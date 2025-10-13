// routes/dietas.js
const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const { protect } = require("../middleware/authMiddleware");

// --- GENERAR DIETA AUTOMÁTICA Y DEVOLVER DETALLE COMPLETO ---
router.post("/generar/:id_mascota", protect, async (req, res) => {
  try {
    const { id_mascota } = req.params;

    const mascota = await prisma.mascota.findUnique({
      where: { id_mascota: parseInt(id_mascota) },
      include: {
        raza: { include: { especie: true } },
        habitos_alimenticios: true,
        historial_salud: true,
      },
    });

    if (!mascota) return res.status(404).json({ error: "Mascota no encontrada." });

    const peso = mascota.peso_inicial;
    const actividad = mascota.actividad;
    const especie = mascota.raza.especie.nombre.toLowerCase();
    const objetivo = mascota.objetivo_dieta || "Mantener peso";

    // Calcular requerimiento calórico base
    let kcalBase = especie === "perro" ? peso * 30 + 70 : peso * 40 + 50;

    // Ajuste por nivel de actividad
    const factorActividad =
      actividad === "Alta" ? 1.3 :
      actividad === "Moderada" ? 1.1 : 0.9;
    kcalBase *= factorActividad;

    // Ajuste por objetivo
    if (objetivo === "Perder peso") kcalBase *= 0.8;
    else if (objetivo === "Ganar peso") kcalBase *= 1.2;

    // Buscar productos compatibles
    const productos = await prisma.producto.findMany({
      where: {
        especie: { equals: mascota.raza.especie.nombre, mode: "insensitive" },
      },
      select: {
        id_producto: true,
        nombre: true,
        tipo: true,
        kcal_por_100g: true,
        precio: true,
        cantidad_disponible: true
      },
    });

    if (productos.length === 0)
      return res.status(404).json({ error: "No hay productos para esta especie." });

    // Seleccionar productos representativos
    const alimento = productos.find(p => p.tipo.toLowerCase().includes("alimento")) || productos[0];
    const snack = productos.find(p => p.tipo.toLowerCase().includes("snack")) || null;
    const suplemento = productos.find(p => p.tipo.toLowerCase().includes("suplemento")) || null;

    // Calcular cantidad recomendada (en gramos)
    const dieta = [
      alimento && {
        id_producto: alimento.id_producto,
        producto: alimento.nombre,
        tipo: "Alimento principal",
        precio: alimento.precio,
        cantidad_recomendada: parseFloat(((kcalBase * 0.9) / alimento.kcal_por_100g * 100).toFixed(2)), // gramos
        kcal_por_100g: alimento.kcal_por_100g
      },
      snack && {
        id_producto: snack.id_producto,
        producto: snack.nombre,
        tipo: "Snack",
        precio: snack.precio,
        cantidad_recomendada: parseFloat(((kcalBase * 0.1) / snack.kcal_por_100g * 100).toFixed(2)),
        kcal_por_100g: snack.kcal_por_100g
      },
      suplemento && {
        id_producto: suplemento.id_producto,
        producto: suplemento.nombre,
        tipo: "Suplemento",
        precio: suplemento.precio,
        cantidad_recomendada: 1,
        kcal_por_100g: suplemento.kcal_por_100g || 0
      }
    ].filter(Boolean);

    // Guardar dieta y detalle
    const dietaGuardada = await prisma.dieta.create({
      data: {
        id_mascota: mascota.id_mascota,
        fecha_generacion: new Date(),
        descripcion: `Dieta automática para ${mascota.nombre}`,
        total_kcal: Math.round(kcalBase),
      },
    });

    for (const item of dieta) {
      await prisma.detalle_dieta.create({
        data: {
          id_dieta: dietaGuardada.id_dieta,
          producto: item.producto,
          tipo: item.tipo,
          cantidad_recomendada: item.cantidad_recomendada,
        },
      });
    }

    res.status(201).json({
      message: "Dieta generada exitosamente",
      mascota: mascota.nombre,
      kcal_diarias: Math.round(kcalBase),
      plan: dieta,
    });
  } catch (error) {
    console.error("Error generando dieta:", error);
    res.status(500).json({ error: "Error al generar la dieta." });
  }
});

module.exports = router;
