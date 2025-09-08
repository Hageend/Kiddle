const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// Aquí se definirán los endpoints CRUD

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        primer_apellido: true,
        segundo_apellido: true,
        correo: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los usuarios.' });
  }
});

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(id) },
      select: {
        id_usuario: true,
        nombre: true,
        primer_apellido: true,
        segundo_apellido: true,
        correo: true,
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el usuario.' });
  }
});


// PUT /api/users/:id - Actualizar un usuario por ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, primer_apellido, segundo_apellido, correo } = req.body;
        const updatedUser = await prisma.usuario.update({
            where: { id_usuario: parseInt(id) },
            data: { nombre, primer_apellido, segundo_apellido, correo },
            select: {
                id_usuario: true,
                nombre: true,
                primer_apellido: true,
                segundo_apellido: true,
                correo: true,
            },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'No se pudo actualizar el usuario.' });
    }
});

module.exports = router;