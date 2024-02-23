import express from 'express';
import { createPost, deletePost, getPost, getPostById, updatePost } from '../controllers/postController.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/posts', verifyUser, getPost);
router.get('/posts/:id', verifyUser, getPostById);
router.post('/posts', verifyUser, createPost);
router.patch('/posts/:id', verifyUser, updatePost);
router.delete('/posts/:id', verifyUser, deletePost);

export default router