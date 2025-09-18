const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const authMiddleware = require('../middlewares/auth');

// Obtener todas las direcciones del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    const direcciones = await prisma.direccion.findMany({
      where: { id_usuario: userId }
    });
    res.json(direcciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
});

// Agregar una nueva dirección
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    const { calle, numero_exterior, numero_interior, colonia, codigo_postal, estado } = req.body;

    const nuevaDireccion = await prisma.direccion.create({
      data: {
        id_usuario: userId,
        calle,
        numero_exterior,
        numero_interior,
        colonia,
        codigo_postal,
        estado
      }
    });

    res.json(nuevaDireccion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear dirección' });
  }
});

module.exports = router;
