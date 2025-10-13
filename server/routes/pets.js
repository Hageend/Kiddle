const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, async (req, res) => {
  try {
    const { nombre, raza, edad, peso, especie } = req.body;
    const mascota = await prisma.mascota.create({
      data: { nombre, raza, edad, peso, especie },
    });
    res.status(201).json(mascota);
  } catch (error) {
    console.error("Error al registrar mascota:", error);
    res.status(500).json({ error: "No se pudo registrar la mascota." });
  }
});

// POST /api/pets/:id_mascota/alimentacion
router.post('/:id_mascota/alimentacion', protect, async (req, res) => {
  try {
    const { id_mascota } = req.params;
    const data = req.body;
    const habito = await prisma.habitos_alimenticios.create({
      data: { id_mascota: parseInt(id_mascota), ...data },
    });
    res.status(201).json(habito);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo registrar alimentación.' });
  }
});

// POST /api/pets/:id_mascota/salud
router.post('/:id_mascota/salud', protect, async (req, res) => {
  try {
    const { id_mascota } = req.params;
    const data = req.body;
    const salud = await prisma.historial_salud.create({
      data: { id_mascota: parseInt(id_mascota), ...data },
    });
    res.status(201).json(salud);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo registrar salud.' });
  }
});

// POST /api/pets/:id_mascota/operacion
router.post('/:id_mascota/operacion', protect, async (req, res) => {
  try {
    const { id_mascota } = req.params;
    const data = req.body;
    const operacion = await prisma.historial_operacion.create({
      data: { id_mascota: parseInt(id_mascota), ...data },
    });
    res.status(201).json(operacion);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo registrar la operación.' });
  }
});

module.exports = router;
