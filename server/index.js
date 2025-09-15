require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const cors = require('cors');

// Middleware para parsear JSON
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const productosRoutes = require('./routes/productos');
const direccionRoutes = require('./routes/direccion');

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes)
app.use('/api/productos', productosRoutes);
app.use('/api/direccion', direccionRoutes);

// Endpoint de prueba
app.get('/api', (req, res) => {
  res.json({ message: "¡Hola desde el servidor Express!" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT} : http://localhost:${PORT}`);
});