// auth/routes/sessionRoutes.js
import express from 'express';
import { sessions } from '../../middleware/logVisitor.js';
import MobileDetect from 'mobile-detect';
import { getModels } from '../../api/models/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutos

router.post('/', async (req, res) => {
  try {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const visitorSessionId = req.body.visitorSessionId || null;
    const key = `${ip}|${userAgent}`;
    const now = Date.now();
    const isBot = req.headers['x-bot'] === 'true';

    const md = new MobileDetect(userAgent);
    const deviceType = md.mobile() ? 'mobile' : md.tablet() ? 'tablet' : 'desktop';

    const { statistics, statistics_crawlers } = await getModels();

    let session = sessions.get(key);
    let expired = false;

    if (
      !session ||
      session.sessionId !== visitorSessionId ||
      now - session.timestamp > SESSION_TTL_MS
    ) {
      expired = !!session;
      const newSessionId = uuidv4();

      const payload = {
        ip_url: ip,
        session_url: newSessionId,
        entry_url: req.headers.referer || null,
        useragent_url: deviceType,
        crawler_url: isBot ? 'robot' : 'human',
        date_url: new Date(),
      };

      if (isBot) {
        await statistics_crawlers.create(payload);
      } else {
        await statistics.create(payload);
      }

      sessions.set(key, {
        sessionId: newSessionId,
        timestamp: now,
      });

      return res.json({ visitorSessionId: newSessionId, expired });
    }

    // Si no expiró, renovar timestamp
    session.timestamp = now;
    sessions.set(key, session);

    res.json({ visitorSessionId: session.sessionId, expired: false });
  } catch (error) {
    console.error('Error en /session:', error);
    res.status(500).json({ error: 'Error al registrar la sesión' });
  }
});

export default router;
