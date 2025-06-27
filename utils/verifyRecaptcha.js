// server/utils/verifyRecaptcha.js
import axios from 'axios';

const verifyRecaptchaToken = async (token, action) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
    const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: { secret, response: token },
    });

    const data = res.data;
    return {
      isHuman: data.success && data.action === action && data.score >= 0.5,
      score: data.score,
      raw: data,
    };
  } catch (err) {
    console.error('Error verificando reCAPTCHA:', err.message);
    return { isHuman: false, score: 0 };
  }
};

export default verifyRecaptchaToken;
