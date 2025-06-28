// api/models/index.js
import fs from 'fs';
import { Sequelize } from 'sequelize';
import getDatabaseConnection from '../../config/database.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  
const basename = path.basename(__filename);
const modelsCache = {}; 

export const getModels = async (dbName) => {
  
  if (modelsCache[dbName]) {
    return modelsCache[dbName];
  }
  const sequelize = getDatabaseConnection(dbName);
  if (!sequelize) {
    throw new Error(`No se pudo establecer una conexión con la base de datos: ${dbName}`);
  }

  const models = {};
  const files = fs.readdirSync(__dirname)
    .filter((file) => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    });

  const modelPromises = files.map(async (file) => {    
    let filePath = path.join(__dirname, file);
    if (process.platform === 'win32') {      
      filePath = `file:///${filePath.replace(/\\/g, '/')}`;
    } else {
      filePath = `file://${filePath}`;
    }
    const { default: modelInit } = await import(filePath); 
    const model = modelInit(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

  await Promise.all(modelPromises);
  
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
    // console.log(`📌 Modelo registrado: ${modelName}`);
    // console.log(`🔗 Asociaciones:`, Object.keys(models[modelName].associations));
  });  
  modelsCache[dbName] = { ...models, sequelize, Sequelize };

  // console.log("Asociaciones disponibles:", Object.keys(models).map(name => ({
  //   model: name, 
  //   hasAssociate: !!models[name].associate
  // })));
  
  return modelsCache[dbName];
};
