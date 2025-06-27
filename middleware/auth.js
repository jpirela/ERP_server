// middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Extraer el token del encabezado Authorization, considerando el prefijo Bearer
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(401).json({ error: 'Sesión Caducada. Debe accesar de nuevo' });
  }

  // Verificar privilegios de administrador para ciertas rutas
  if (req.url.includes('/change-role') || req.url.includes('/change-authorization')) {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Admin privileges required.' });
    }
  }
};

export default auth;
