const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// GET /api/data/razas - Obtener todas las razas
router.get('/razas', async (req, res) => {
  try {
    const razas = await prisma.raza.findMany({
      select: {
        id_raza: true,
        id_especie: true,
        nombre: true,
      }
    });
    res.json(razas);
  } catch (error) {
    console.error("Error al obtener razas:", error);
    res.status(500).json({ error: 'No se pudieron obtener las razas.' });
  }
});


//GET /api/data/especies - Obtener todas las especies
router.get('/especies', async (req, res) => {
  try {
    const especies = await prisma.especie.findMany({
      select: {
        id_especie: true,
        nombre: true,
      }
    });
    res.json(especies)
  } catch (error) {
    console.error("Error al obtener especies: ", error);
    res.status(500).json({ error: 'No se pudieron obtener las especies.'})
  }
})

module.exports = router;