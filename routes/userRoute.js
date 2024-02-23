import express from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/userController.js'
import {verifyUser, adminOnly} from '../middlewares/authUser.js'

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', verifyUser, adminOnly, createUser);
router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);


export default router