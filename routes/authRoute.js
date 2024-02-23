import express from 'express';
import { LogOut, Me, login } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', Me);
router.post('/login', login);
router.delete('/logout/', LogOut);



export default router