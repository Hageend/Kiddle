const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      select: {
        id_producto: true,
        codigo_sku: true,
        nombre: true,
        marca: true,
        edad_recomendada: true,
        tipo_alimento: true,
        sabor_principal: true,
        precio: true,
        cantidad_disponible: true,
        tipo_empaque: true,
        peso_empaque_kg: true,
      },
    });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: 'No se pudieron cargar los productos.' });
  }
});

module.exports = router;
