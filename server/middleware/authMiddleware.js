// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtenemos el token de "Bearer TOKEN_LARGO"
      token = req.headers.authorization.split(' ')[1];
      
      // Verificamos el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adjuntamos el usuario decodificado (sin el password) al request
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token no válido o expirado.' });
    }
  }
  if (!token) {
    res.status(401).json({ error: 'No autorizado, no hay token.' });
  }
};

module.exports = { protect };