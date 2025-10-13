const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const userId = req.user.id_usuario;
  const carrito = await prisma.carrito.findMany({ where: { id_usuario: userId } });
  res.json(carrito);
});

module.exports = router;
