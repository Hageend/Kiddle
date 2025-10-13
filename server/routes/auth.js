// routes/auth.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/register - Registrar un nuevo usuario + dirección
router.post('/register', async (req, res) => {
  try {
    const {
      nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      contraseña,
      telefono,
      // campos de direccion (opcionales)
      calle,
      numero_exterior,
      numero_interior,
      colonia,
      codigo_postal,
      estado
    } = req.body;

    // Validaciones básicas (puedes ampliarlas)
    if (!nombre || !primer_apellido || !correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // Verificar si ya existe el correo
    const existing = await prisma.usuario.findUnique({ where: { correo } });
    if (existing) {
      return res.status(409).json({ error: 'El correo ya está registrado.' });
    }

    // Hashear la contraseña
    const contraseña_hash = await bcrypt.hash(contraseña, 10);

    // Crear usuario y (opcional) direccion en la misma transacción
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        contrase_a_hash: contraseña_hash, // campo en prisma
        telefono,
        // Si se proporcionó al menos una propiedad de dirección, crearla
        direccion: (calle || codigo_postal || colonia || numero_exterior || numero_interior || estado)
          ? {
              create: {
                calle: calle || '',
                numero_exterior: numero_exterior || null,
                numero_interior: numero_interior || null,
                colonia: colonia || '',
                codigo_postal: codigo_postal || '',
                estado: estado || ''
              }
            }
          : undefined
      },
      include: {
        direccion: true
      }
    });

    // No devolver el hash
    const { contrase_a_hash: _, ...userSafe } = newUser;
    res.status(201).json({ message: 'Usuario creado', user: userSafe });

  } catch (error) {
    console.error('Error en /auth/register', error);
    res.status(500).json({ error: 'No se pudo registrar el usuario.' });
  }
});

module.exports = router;
