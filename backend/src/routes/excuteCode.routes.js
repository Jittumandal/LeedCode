import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import excuteCode from '../controllers/excuteCode.controller.js';

const excutionRoutes = express.Router()

excutionRoutes.post('/', authMiddleware, excuteCode)


export default excutionRoutes;
