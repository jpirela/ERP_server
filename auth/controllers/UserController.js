// auth/controllers/UserController.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getModels } from '../models/index.js';
import { sessions } from '../../middleware/logVisitor.js';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import os from 'os';
import { parse } from 'useragent';

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = 'Europe/Madrid'; // zona horaria oficial

function sha256(str) {
  if (typeof str !== 'string') {
    throw new TypeError('El argumento para sha256 debe ser una cadena de texto.');
  }
  return crypto.createHash('sha256').update(str).digest('hex');
}

export const login = async (req, res) => {
  const { correo, contraseña, rol, dbName } = req.body;

  const models = await getModels(dbName);
  const User = models.users;

  try {
    const user = await User.findOne({ where: { correo } }); // ✅ usar 'correo'

    if (user) {
      const hashedPassword = sha256(contraseña);            // ✅ usar 'contraseña'
      const isMatch = hashedPassword === user.contraseña;

      if (isMatch) {
        const payload = {
          id: user.id_usuario,
          name: user.nombre,
          email: user.correo,
          is_admin: rol === 'admin'
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
      } else {
        res.status(400).json({ message: 'Contraseña incorrecta' });
      }
    } else {
      res.status(400).json({ message: 'Este usuario no existe' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const profile = async (req, res) => {
  const { authorization } = req.headers;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Desconocido';
  const hostname = os.hostname();

  if (!authorization) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(authorization, process.env.SECRET_KEY);
    const models = await getModels(req.dbName);

    const User = models.users;
    const UserLog = models.users_log;

    const user = await User.findOne({ where: { id_usuario: decoded.id } });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Parsear datos del navegador
    const agent = parse(userAgent);
    const browser = agent.family || 'Desconocido';
    const browserVersion = agent.toVersion() || 'Desconocido';
    const operatingSystem = agent.os?.toString() || 'Desconocido';

    // Log de acceso
    await UserLog.create({
      userId: user.id_usuario,
      loginAt: new Date(),
      ip,
      hostname,
      userAgent,
      browser,
      browserVersion,
      operatingSystem
    });

    // Devolver el perfil del usuario
    res.json({
      id: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      fecha_registro: user.fecha_registro
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  const { 
    nombre,
    correo,
    contraseña,
    rol,
    fecha_registro,
    dbName } = req.body;

  const models = await getModels(dbName);

  const User = models.users;

  try {
    console.log('Attempting to find user with email:', correo);
    const user = await User.findOne({ where: { correo } });
    console.log('User found:', user);
    
    if (!user) {
      const hash = sha256(contraseña);
      const newUser = await User.create({
        nombre,
        correo,
        contraseña: hash,
        rol,
        fecha_registro: new Date(),

      });
      const payload = {
        id: newUser.id_usuario,
        name: newUser.nombre,
        email: newUser.correo,
        rol: newUser.rol,
      };
      
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
      
      res.json({ status: newUser.correo + ' registered', token });
    } else {
      res.status(400).json({ error: 'Este usuario ya existe, cambie el email' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  const { authorization } = req.headers;
  const models = await getModels(req.dbName);
  const UserLog = models.UserLog;

  try {
    const decoded = jwt.verify(authorization, process.env.SECRET_KEY);
    const userLog = await UserLog.findOne({
      where: {
        user_id: decoded.id,
        logout_at: null
      }
    });
    if (userLog) {
      userLog.logout_at = new Date();
      await userLog.save();
    }

    // Cierra la sesión del visitor tracking
    const key = `${req.ip}|${req.headers['user-agent']}`;
    if (sessions.has(key)) {
      sessions.delete(key);
    }

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, preferences } = req.body;

  try {
    const models = await getModels(req.dbName); // ✅ Esperamos la resolución
    const User = models.User;
    const user = await User.findByPk(id);
    if (user) {
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.preferences = preferences || user.preferences;

      await user.save();
      res.json({ status: 'User updated successfully', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const models = await getModels(req.dbName); // ✅ Esperamos la resolución
    const User = models.User;
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({ status: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeAuthorization = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const { authorized } = req.body; // Valor de autorización (true o false)
  const models = await getModels(req.dbName); // ✅ Esperamos la resolución
  const User = models.User;

  try {
    const user = await User.findByPk(id);
    if (user) {
      user.authorized = authorized;
      await user.save();
      res.json({ status: 'Authorization status updated successfully', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeRole = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const { role } = req.body; // Nuevo rol (ejemplo: 'admin', 'user', 'moderator')
  const models = await getModels(req.dbName); // ✅ Esperamos la resolución
  const User = models.User;

  try {
    const user = await User.findByPk(id);
    if (user) {
      user.role = role;
      await user.save();
      res.json({ status: 'User role updated successfully', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { correo } = req.body;
  const models = await getModels(req.dbName);
  const PasswordResetToken = models.PasswordResetToken;
  const User = models.User;


  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = dayjs().tz(TZ).toDate(); // Fecha actual en Madrid
    const expiresAt = dayjs(createdAt).add(1, 'hour').toDate(); // +1 hora en Madrid

    // Configura el transporte (ejemplo con Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'soporteERP@gmail.com',
        pass: 'password',
      },
    });

    await PasswordResetToken.create({
      email,
      code,
      created_at: createdAt,
      expires_at: expiresAt,
      used: false
    });

    // Envía el correo
    await transporter.sendMail({
      from: '"Soporte" <soporteERP@gmail.com>',
      to: email,
      subject: 'Código de recuperación',
      text: `Tu código de recuperación es: ${code}`,
    });

    res.status(200).json({ message: 'Código enviado con éxito.' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ error: 'Error al enviar el código de reactivación.' });
  }
};


export const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  const models = await getModels(req.dbName);
  const { PasswordResetToken } = models;

  try {
    const token = await PasswordResetToken.findOne({
      where: { email, code, used: false },
    });

    if (!token) {
      return res.status(400).json({ error: 'Código inválido o ya usado.' });
    }

    const now = dayjs().tz(TZ); // Ahora en Madrid
    const expiresAt = dayjs(token.expires_at).tz(TZ);

    if (now.isAfter(expiresAt)) {
      token.used = true;
      await token.save();
      return res.status(400).json({ error: 'Código de reactivación caducado porque superó 1 hora en ser usado' });
    }

    res.status(200).json({ message: 'Código válido' });
  } catch (error) {
    console.error('Error en verifyResetCode:', error);
    res.status(500).json({ error: 'Error al verificar el código.' });
  }
};


export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const models = await getModels(req.dbName);
  const PasswordResetToken = models.PasswordResetToken;
  const User = models.User;

  try {
    
    if (!newPassword || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'La nueva contraseña es obligatoria y debe ser una cadena de texto.' });
    }

    const token = await PasswordResetToken.findOne({
      where: { email, code, used: false },
    });

    if (!token) {
      return res.status(400).json({ error: 'Código inválido o ya utilizado.' });
    }

    const now = dayjs().tz(TZ);
    const expiresAt = dayjs(token.expires_at).tz(TZ);

    if (now.isAfter(expiresAt)) {
      token.used = true;
      await token.save();
      return res.status(400).json({ error: 'El código ha expirado.' });
    }

    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    user.password = sha256(newPassword);
    await user.save();

    token.used = true;
    await token.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña.' });
  }
};
