const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const { protect } = require('../middleware/authMiddleware');

// GET /api/pets - Obtener todas las mascotas del usuario *Autenticado*
router.get('/', protect, async (req, res) => {
  try {
    const mascotas = await prisma.mascota.findMany({
      where: {
        id_usuario: req.user.id_usuario
      }
    });
    res.json(mascotas)
  } catch (error) {
    res.status(500).json({error: 'No se pudieron obtener las mascotas.'});
  }
})


// POST /api/pets - Registrar una nueva mascota
router.post('/', protect, async (req, res) => {
  
  try {
    const { 
    id_raza, nombre, sexo, fecha_nacimiento, peso_inicial, 
    altura, tamaño, esterilizado, actividad 
    } = req.body;
    
    const nuevaMascota = await prisma.mascota.create({
      data: {
        id_usuario: req.user.id_usuario,
        id_raza: parseInt(id_raza),
        nombre,
        sexo,
        fecha_nacimiento: new Date(fecha_nacimiento),
        peso_inicial: parseFloat(peso_inicial),
        altura: parseFloat(altura),
        tama_o: tamaño,
        esterilizado,
        actividad
      }
    });
    res.status(201).json(nuevaMascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo registrar la mascota.' });
  }
});

// POST /api/pets/:id_mascota/salud - Registrar historial de salud para una mascota
router.post('/:id_mascota/salud', protect, async (req, res) => {
  const { id_mascota } = req.params;
  const { enfermedades, medicamentos, alergias_alimento, sintomas_alergia, operaciones } = req.body;

  try {
    // Usamos una transacción por si hay que crear en 2 tablas (salud y operaciones)
    const resultado = await prisma.$transaction(async (tx) => {
      // Crear el historial de salud principal
      const historial = await tx.historial_salud.create({
        data: {
          id_mascota: parseInt(id_mascota),
          enfermedades,
          medicamentos,
          alergias_alimento,
          sintomas_alergia
        }
      });

      // Si el usuario registró operaciones, las creamos también
      if (operaciones && operaciones.length > 0) {
        const datosOperaciones = operaciones.map(op => ({
          id_mascota: parseInt(id_mascota),
          tipo_operacion: op.tipo_operacion,
          fecha_operacion: new Date(op.fecha_operacion)
        }));
        await tx.historial_operacion.createMany({
          data: datosOperaciones
        });
      }
      return historial;
    });

    res.status(201).json({ message: "Historial de salud registrado", data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo registrar el historial de salud.' });
  }
});

// POST /api/pets/:id_mascota/habitos - Registrar hábitos alimenticios para una mascota
router.post('/:id_mascota/habitos', protect, async (req, res) => {
  const { id_mascota } = req.params;
  const { alimento_principal, cantidad_diaria, recibe_sobras, tipo_sobras, recibe_premios, tipo_premios } = req.body;

  try {
    const nuevosHabitos = await prisma.habitos_alimenticios.create({
      data: {
        id_mascota: parseInt(id_mascota),
        alimento_principal,
        cantidad_diaria: parseFloat(cantidad_diaria),
        recibe_sobras,
        tipo_sobras,
        recibe_premios,
        tipo_premios
      }
    });
    res.status(201).json({ message: "Mascota registrada completamente.", data: nuevosHabitos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron registrar los hábitos alimenticios.' });
  }
});

module.exports = router;