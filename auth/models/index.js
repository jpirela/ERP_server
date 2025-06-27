import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import getDatabaseConnection from '../../config/database.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);
const modelsCache = {};

const getModels = async (dbName) => {
  if (modelsCache[dbName]) {
    return modelsCache[dbName];
  }

  const sequelize = getDatabaseConnection(dbName);
  const models = {};

  const files = fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.endsWith('.js'));

  // Importa todos los modelos de forma asíncrona
  await Promise.all(
    files.map(async (file) => {
      const modelModule = await import(pathToFileURL(path.join(__dirname, file)).href);
      const model = modelModule.default(sequelize, Sequelize.DataTypes);
      models[model.name] = model;
    })
  );

  // Configura las asociaciones si existen
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  modelsCache[dbName] = { ...models, sequelize };
  return modelsCache[dbName];
};

export { getModels };
