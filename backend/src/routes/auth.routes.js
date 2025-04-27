import express from 'express'
import { getProfile, LoginUser, LogoutUser, registerUser } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js'


const authRoutes = express.Router()

authRoutes.post('/register', registerUser);
authRoutes.post('/login', LoginUser)
authRoutes.post('/Logout', authMiddleware, LogoutUser)
authRoutes.get('/check', authMiddleware, getProfile)


export default authRoutes