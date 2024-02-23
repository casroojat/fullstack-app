import express from 'express';
import { createPostCategory, deletePostCategory, getPostCategory, getPostCategoryById, updatePostCategory } from '../controllers/postCategoryController.js';

const router = express.Router();

router.get('/post-category', getPostCategory);
router.get('/post-category/:id', getPostCategoryById);
router.post('/post-category', createPostCategory);
router.patch('/post-category/:id', updatePostCategory);
router.delete('/post-category/:id', deletePostCategory);

export default router