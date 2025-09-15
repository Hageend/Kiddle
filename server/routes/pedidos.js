const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client'); // tu cliente Prisma

router.post('/', async (req, res) => {
  try {
    const { id_pedido, productos } = req.body;

    const detalle = await Promise.all(
      productos.map(async (p) => {
        return prisma.detalle_pedido.create({
          data: {
            id_pedido,
            id_producto: p.id_producto,
            cantidad: p.cantidad,
            precio_unitario: p.precio,
            subtotal: p.precio * p.cantidad
          },
        });
      })
    );

    res.json({ message: 'Detalle del pedido creado', detalle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear el detalle del pedido' });
  }
});

module.exports = router;
