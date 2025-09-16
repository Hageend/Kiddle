const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

router.post("/", async (req, res) => {
  const { id_usuario, id_direccion_entrega, productos, total } = req.body;

  try {
    const pedido = await prisma.pedido.create({
      data: {
        id_usuario,
        id_direccion_entrega,
        total,
        estado: "Pendiente"
      }
    });
    for (const p of productos) {
      await prisma.detalle_pedido.create({
        data: {
          id_pedido: pedido.id_pedido,
          id_producto: p.id_producto,
          cantidad: p.cantidad,
          precio_unitario: p.precio,
          subtotal: p.cantidad * p.precio
        }
      });

      await prisma.producto.update({
        where: { id_producto: p.id_producto },
        data: { cantidad_disponible: { decrement: p.cantidad } }
      });
    }

    res.status(201).json({ message: "Pedido creado con éxito", pedido });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo procesar el pedido" });
  }
});

module.exports = router;
