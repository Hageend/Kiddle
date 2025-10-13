// routes/orders.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders
// body: { id_direccion_entrega: number, items: [{ id_producto, cantidad }] }
router.post('/', protect, async (req, res) => {
  const { id_direccion_entrega, items } = req.body;
  const id_usuario = req.user.id_usuario;

  if (!id_direccion_entrega || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Faltan datos: dirección o items.' });
  }

  try {
    // Cálculo de totales y validaciones por producto
    let total = 0;
    const detalleToCreate = [];

    // Traer productos por ids
    const productIds = items.map(i => parseInt(i.id_producto));
    const productos = await prisma.producto.findMany({
      where: { id_producto: { in: productIds } }
    });
    const prodMap = Object.fromEntries(productos.map(p => [p.id_producto, p]));

    for (const it of items) {
      const idp = parseInt(it.id_producto);
      const cantidad = parseInt(it.cantidad);
      const producto = prodMap[idp];

      if (!producto) return res.status(404).json({ error: `Producto ${idp} no encontrado.` });
      if (producto.cantidad_disponible < cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.cantidad_disponible}` });
      }

      const subtotal = parseFloat(producto.precio) * cantidad;
      total += subtotal;

      detalleToCreate.push({
        id_producto: idp,
        cantidad,
        precio_unitario: producto.precio,
        subtotal
      });
    }

    // Crear pedido dentro de transacción
    const created = await prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          id_usuario: id_usuario,
          total: total,
          estado: 'Pagado', // como no hay integración de pagos, asumimos 'Pagado' o 'Pendiente'
          id_direccion_entrega: id_direccion_entrega
        }
      });

      // Crear detalle_pedido y decrementar inventario
      for (const det of detalleToCreate) {
        await tx.detalle_pedido.create({
          data: {
            id_pedido: pedido.id_pedido,
            id_producto: det.id_producto,
            cantidad: det.cantidad,
            precio_unitario: det.precio_unitario,
            subtotal: det.subtotal
          }
        });

        // Decrementar inventario (simple)
        await tx.producto.update({
          where: { id_producto: det.id_producto },
          data: { cantidad_disponible: { decrement: det.cantidad } }
        });
      }

      return pedido;
    });

    res.status(201).json({ message: 'Pedido creado', pedido_id: created.id_pedido, total });
  } catch (error) {
    console.error("Error en POST /api/orders:", error);
    res.status(500).json({ error: 'No se pudo crear el pedido.' });
  }
});

module.exports = router;
