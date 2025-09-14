const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// GET /api/data/razas - Obtener todas las razas
router.get('/razas', async (req, res) => {
  try {
    const razas = await prisma.raza.findMany({
      select: {
        id_raza: true,
        nombre: true,
      }
    });
    res.json(razas);
  } catch (error) {
    console.error("Error al obtener razas:", error);
    res.status(500).json({ error: 'No se pudieron obtener las razas.' });
  }
});

module.exports = router;