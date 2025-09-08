require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT | 3001;

const userRoutes = require('./routes/users')
app.use('/api/users', userRoutes)

// Middleware para parsear JSON
app.use(express.json());

// Endpoint de prueba
app.get('/api', (req, res) => {
  res.json({ message: "¡Hola desde el servidor Express!" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT} : http://localhost:${PORT}`);
});