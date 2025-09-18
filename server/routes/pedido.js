const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

// Confirmar compra (crear pedido con dirección seleccionada)
router.post("/:userId/confirmar", async (req, res) => {
  const { userId } = req.params;
  const { idDireccion } = req.body;

  try {
    // 1. Buscar carrito
    const carrito = await prisma.carrito.findFirst({
      where: { idUsuario: parseInt(userId) },
      include: { items: { include: { producto: true } } },
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // 2. Calcular total
    const total = carrito.items.reduce(
      (acc, item) => acc + item.cantidad * item.producto.precio,
      0
    );

    // 3. Crear pedido
    const pedido = await prisma.pedido.create({
      data: {
        idUsuario: parseInt(userId),
        idDireccion,
        total,
      },
    });

    // 4. Vaciar carrito después de la compra
    await prisma.carritoItem.deleteMany({
      where: { idCarrito: carrito.id },
    });

    res.json({ message: "Compra confirmada", pedido });
  } catch (error) {
    res.status(500).json({ error: "Error al confirmar compra", details: error });
  }
});

module.exports = router;
