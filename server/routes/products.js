// routes/products.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

const { protect } = require("../middleware/authMiddleware");

// GET /api/products - lista todos los productos disponibles (cantidad_disponible > 0)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.producto.findMany({
      where: { cantidad_disponible: { gt: 0 } },
      select: {
        id_producto: true,
        codigo_sku: true,
        nombre: true,
        marca: true,
        id_especie: true,
        edad_recomendada: true,
        tama_o: true,
        tipo_alimento: true,
        sabor_principal: true,
        proteina: true,
        grasa: true,
        fibra: true,
        calorias_por_kg: true,
        peso_empaque_kg: true,
        tipo_empaque: true,
        precio: true,
        cantidad_disponible: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error("Error en GET /api/products:", error);
    res.status(500).json({ error: 'No se pudieron obtener los productos.' });
  }
});

module.exports = router;
