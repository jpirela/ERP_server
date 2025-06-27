// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { format } from 'sql-formatter';

dotenv.config();

const connections = {};

const createDatabaseConnection = (dbName) => {
  const { DB_USER, DB_PORT, DB_PASSWORD, IP_PRODUCTION, IP_DEVELOPMENT, MODE_ENV, DB_NAME } = process.env;
  const host = MODE_ENV === 'production' ? IP_PRODUCTION : IP_DEVELOPMENT;
  const password = DB_PASSWORD ? `:${DB_PASSWORD}` : '';
  const database = dbName || DB_NAME;

  const databaseUrl = `mysql://${DB_USER}${password}@${host}:${DB_PORT}/${database}`;

  const logSql = (msg) => {
    try {
      // Filtrar solo sentencias SQL reales (ignorando comandos internos o no parseables)
      if (!msg.startsWith('Executing')) return console.log(`\n[Sequelize]: ${msg}`);

      const cleanMsg = msg.replace(/^Executing \(.*?\): /, '');
      const formatted = format(cleanMsg, { language: 'mysql' });
      console.log(`[Sequelize]:\n${formatted}`);
    } catch (err) {
      console.warn('[Sequelize:raw]', msg); // fallback sin formatear
    }
  };

  return new Sequelize(databaseUrl, {
    dialect: 'mysql',
    logging: MODE_ENV === 'development' ? logSql : false,
    define: {
      timestamps: false
    },
  });
};

const getDatabaseConnection = (dbName) => {
  const database = dbName || process.env.DB_NAME;

  if (!connections[database]) {
    connections[database] = createDatabaseConnection(database);
  }

  return connections[database];
};

export default getDatabaseConnection;
