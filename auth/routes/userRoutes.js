// auth/routes/UserRoutes.js
import express from 'express';
import * as UserController from '../controllers/UserController.js';
import auth from '../../middleware/auth.js';
import setAuthDatabase from '../../middleware/setAuthDatabase.js';

const router = express.Router();

router.use(setAuthDatabase);

// Rutas de autenticación
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/verify-reset-code', UserController.verifyResetCode);
router.post('/reset-password', UserController.resetPassword);
router.post('/logout', auth, UserController.logout);
router.get('/profile', auth, UserController.profile);

// Rutas CRUD
router.put('/update/:id', auth, UserController.updateUser);
router.delete('/delete/:id', auth, UserController.deleteUser);

// Rutas para cambiar autorización y rol
router.put('/change-authorization/:id', auth, UserController.changeAuthorization);
router.put('/change-role/:id', auth, UserController.changeRole);

export default router;
