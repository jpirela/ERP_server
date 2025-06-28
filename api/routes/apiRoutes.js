// api/routes/apiRoutes.js
import express from 'express';
import * as apiController from '../controllers/apiControllers.js';
import sqlController from '../controllers/sqlControllers.js';
import auth from '../../middleware/auth.js';
import selectDatabase from '../../middleware/selectDatabase.js';

const router = express.Router();

// Ruta para procesar SQL
router.post('/execute-sql', auth, selectDatabase, sqlController);

// Middleware para pasar el esquema, modelo y base de datos a los controladores
router.use('/:modelName', auth, selectDatabase, (req, res, next) => {
  req.modelName = req.params.modelName;
  next();
});

// Rutas genéricas basadas en modelos
router.get('/:modelName', apiController.getAll);
router.get('/:modelName/:id', apiController.getById);
router.post('/:modelName', apiController.create);
router.put('/:modelName/:id', apiController.updateById);
router.delete('/:modelName/:id', apiController.deleteById);

export default router;
