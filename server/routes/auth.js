const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/register - Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, primer_apellido, segundo_apellido, correo, contraseña } = req.body;
    
    // 1. Hashear la contraseña
    const contraseña_hash = await bcrypt.hash(contraseña, 10);

    // 2. Crear el usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        contrase_a_hash: contraseña_hash, // Guardamos el hash
      },
    });

    // No devolvemos el hash de la contraseña
    const { contrase_a_hash: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo registrar el usuario.' });
  }
});


// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    
    // 1. Buscar al usuario por su correo
    const user = await prisma.usuario.findUnique({ where: { correo } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // 2. Comparar la contraseña enviada con el hash guardado
    const isValidPassword = await bcrypt.compare(contraseña, user.contrase_a_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // 3. Crear un Token (JWT)
    const token = jwt.sign(
      { id_usuario: user.id_usuario, correo: user.correo },
      process.env.JWT_SECRET, // Variable en .env
      { expiresIn: '1d' } // El token expira en 1 día
    );
    
    res.json({ message: "Login exitoso", token });

  } catch (error) {
    res.status(500).json({ error: 'No se pudo iniciar sesión.' });
  }
});

module.exports = router;