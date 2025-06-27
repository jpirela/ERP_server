// middleware/selectDatabase.js
import { getModels } from '../api/models/index.js';  // Especifica el archivo exacto

const selectDatabase = (req, res, next) => {
  const databaseName = req.query.dbName || req.dbName || process.env.DB_NAME;

  console.log("machete");
  
  // Obtén los modelos y la instancia de Sequelize para la base de datos solicitada
  const models = getModels(databaseName);
  req.models = models;
  req.sequelize = models.sequelize; // Inyecta Sequelize en la solicitud
  req.database = databaseName;
  next();
};

export default selectDatabase;
