// middleware/logVisitor.js
import { getModels } from '../api/models/index.js';
import MobileDetect from 'mobile-detect';
import { v4 as uuidv4 } from 'uuid';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

// Utilidades para ruta y archivos
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar lista de crawlers
const crawlerUserAgents = JSON.parse(
  await readFile(path.join(__dirname, '../config/crawler-user-agents.json'), 'utf-8')
);
const knownCrawlers = crawlerUserAgents.map(crawler => crawler.pattern);

// TTL de sesión (1 hora)
const SESSION_TTL_MS = 60 * 60 * 1000;

// Mapa para gestionar sesiones
const sessions = new Map();

// Función para detectar bots
const isBot = (userAgent) => {
  return knownCrawlers.some(pattern => {
    try {
      return new RegExp(pattern, 'i').test(userAgent);
    } catch {
      return false;
    }
  });
};

// Limpiar IPs locales
const sanitizeIP = (ip) => {
  if (!ip) return '';
  const normalized = ip.trim();
  return (normalized === '::1' || normalized === '127.0.0.1' || normalized === 'localhost') ? '' : normalized;
};

// Middleware principal
const logVisitor = async (req, res, next) => {
  try {
    if (req.originalUrl === '/favicon.ico') return next();

    const ip = sanitizeIP(req.ip);
    const userAgent = req.headers['user-agent'] || '';
    const key = `${ip}|${userAgent}`;
    const now = Date.now();

    // Si ya existe y no ha expirado, no registrar de nuevo
    const session = sessions.get(key);
    if (session && now - session.timestamp < SESSION_TTL_MS) {
      return next();
    }

    const { statistics, statistics_crawlers } = await getModels();
    const md = new MobileDetect(userAgent);
    const sessionId = uuidv4();
    req.visitorSessionId = sessionId;

    const deviceType = md.mobile() ? 'mobile' : md.tablet() ? 'tablet' : 'desktop';
    const isCrawler = isBot(userAgent);
    const payload = {
      ip_url: ip,
      session_url: sessionId,
      entry_url: req.headers.referer || null,
      useragent_url: deviceType,
      crawler_url: isCrawler ? 'robot' : 'human',
      date_url: new Date(),
    };

    // Guardar en la tabla correspondiente
    if (isCrawler) {
      await statistics_crawlers.create(payload);
    } else {
      await statistics.create(payload);
    }

    // Registrar en memoria
    sessions.set(key, {
      timestamp: now,
      sessionId,
    });

    next();
  } catch (error) {
    console.error('Error en logVisitor:', error);
    next();
  }
};

// Limpiador de sesiones expiradas (cada 10 minutos)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of sessions.entries()) {
    if (now - value.timestamp > SESSION_TTL_MS) {
      sessions.delete(key);
    }
  }
}, 10 * 60 * 1000); // cada 10 minutos

// Exportaciones
export default logVisitor;
export { sessions };
