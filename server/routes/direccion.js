const express = require('express');
const prisma = require('../prisma/client');
const router = express.Router();


// GET /api/direccion - obtener todas las direcciones
router.get('/', async (req, res) => {
  try {
    const direcciones = await prisma.direccion.findMany({
      select: {
        id_direccion: true,
        id_usuario: true,
        calle: true,
        numero_exterior: true,
        numero_interior: true,
        colonia: true,
        codigo_postal: true,
        estado: true,
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            correo: true,
          },
        },
      },
    });
    res.json(direcciones);
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    res.status(500).json({ error: 'No se pudieron cargar las direcciones.' });
  }
});

// GET /api/direccion/:id - obtener una dirección por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const direccion = await prisma.direccion.findUnique({
      where: { id_direccion: parseInt(id) },
      select: {
        id_direccion: true,
        id_usuario: true,
        calle: true,
        numero_exterior: true,
        numero_interior: true,
        colonia: true,
        codigo_postal: true,
        estado: true,
      },
    });
    if (!direccion) {
      return res.status(404).json({ error: "Dirección no encontrada." });
    }
    res.json(direccion);
  } catch (error) {
    console.error("Error al obtener dirección:", error);
    res.status(500).json({ error: 'No se pudo cargar la dirección.' });
  }
});

// POST /api/direccion - crear nueva dirección
router.post('/', async (req, res) => {
  try {
    const { id_usuario, calle, numero_exterior, numero_interior, colonia, codigo_postal, estado } = req.body;
    const nuevaDireccion = await prisma.direccion.create({
      data: {
        id_usuario,
        calle,
        numero_exterior,
        numero_interior,
        colonia,
        codigo_postal,
        estado,
      },
    });
    res.status(201).json(nuevaDireccion);
  } catch (error) {
    console.error("Error al crear dirección:", error);
    res.status(500).json({ error: 'No se pudo crear la dirección.' });
  }
});

// PUT /api/direccion/:id - actualizar una dirección
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { calle, numero_exterior, numero_interior, colonia, codigo_postal, estado } = req.body;
    const direccionActualizada = await prisma.direccion.update({
      where: { id_direccion: parseInt(id) },
      data: { calle, numero_exterior, numero_interior, colonia, codigo_postal, estado },
    });
    res.json(direccionActualizada);
  } catch (error) {
    console.error("Error al actualizar dirección:", error);
    res.status(500).json({ error: 'No se pudo actualizar la dirección.' });
  }
});

// DELETE /api/direccion/:id - eliminar una dirección
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.direccion.delete({
      where: { id_direccion: parseInt(id) },
    });
    res.json({ message: "Dirección eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar dirección:", error);
    res.status(500).json({ error: 'No se pudo eliminar la dirección.' });
  }
});

module.exports = router;
