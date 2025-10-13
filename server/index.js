require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT | 3001;


const cors = require('cors');

// Middleware para parsear JSON
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const petsRoutes = require('./routes/pets');
const direccionRoutes = require("./routes/direccion");
const pedidoRoutes = require("./routes/pedido");
const dietasRouter = require("./routes/dietas");


app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes)
app.use('/api/pets', petRoutes)
app.use("/api/direccion", direccionRoutes);
app.use("/api/pedido", pedidoRoutes);
app.use("/api/dietas", dietasRouter);

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users'); // donde añadimos /addresses

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);

// Endpoint de prueba
app.get('/api', (req, res) => {
  res.json({ message: "¡Hola desde el servidor Express!" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT} : http://localhost:${PORT}`);
});