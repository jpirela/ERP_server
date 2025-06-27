// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getDatabaseConnection from './config/database.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
import userRoutes from './auth/routes/userRoutes.js';
import apiRoutes from './api/routes/apiRoutes.js';
import publicRoutes from './api/routes/publicRoutes.js';

app.use('/auth', userRoutes);
app.use('/api', apiRoutes);
app.use('/public', publicRoutes);

// Ruta comodín
app.get('*', (req, res) => {
  res.json({ message: 'Bienvenido'});
});

// Iniciar servidor y DB
const startServer = async () => {
  try {
    const sequelize = getDatabaseConnection(); // solo la inicializa
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
