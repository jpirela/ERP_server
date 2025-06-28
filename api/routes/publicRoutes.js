// api/routes/publicRoutes.js
import express from 'express';
const router = express.Router();
import publicModels from '../../config/publicModels.js'; // Importar modelos públicos
import dotenv from 'dotenv';
import * as apiController from '../controllers/apiControllers.js'; // Importar los controladores
import selectDatabase from '../../middleware/selectDatabase.js'; // Importar el middleware de selección de base de datos

dotenv.config();

// Middleware para validar si la ruta pública está autorizada
const validatePublicRouteMiddleware = (req, res, next) => {
  const API_KEY = req.body.API_KEY || req.headers['api_key'] || req.headers['API_KEY'] || req.query['APIKEY'] || req.query['apikey'];
  const expectedAPI_KEY = process.env.API_KEY;

  req.modelName = req.params.modelName;

  if (!publicModels.includes(req.modelName)) {
    req.isPublic = false;
    return next();
  }

  if (!API_KEY) {
    return res.status(400).json({ error: 'API Key is required.' });
  }

  if (API_KEY !== expectedAPI_KEY) {
    return res.status(403).json({ error: 'Invalid API Key. Access denied.' });
  }

  req.isPublic = true;
  next();
};

// Aplicar middleware selectDatabase para todas las rutas
router.use(selectDatabase);

// Rutas públicas
router.get('/:modelName', validatePublicRouteMiddleware, (req, res) => {
  if (req.isPublic) {
    if (req.modelName === 'products_images_all') {
      return apiController.getProductImages(req, res);
    }
    return apiController.getAll(req, res);
  } else {
    res.status(403).json({ error: `Access denied to public route: ${req.modelName}` });
  }
});

router.get('/:modelName/:id', validatePublicRouteMiddleware, (req, res) => {
  if (req.isPublic) {
    return apiController.getById(req, res);
  } else {
    res.status(403).json({ error: `Access denied to public route: ${req.modelName}` });
  }
});

export default router;
