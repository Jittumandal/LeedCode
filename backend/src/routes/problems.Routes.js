import express from 'express';
import { authMiddleware, checkAdmin } from '../middleware/authMiddleware.js';
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUserId, getProblembyId, updateProblem } from '../controllers/problems.controller.js';



const problemsRoutes = express.Router();

problemsRoutes.post('/create-problem', authMiddleware, checkAdmin, createProblem)

problemsRoutes.get('/get-problems', authMiddleware, getAllProblems)

problemsRoutes.get('/get-problem/:id', authMiddleware, getProblembyId)

problemsRoutes.put('/update-problem/:id', authMiddleware, checkAdmin, updateProblem)

problemsRoutes.delete('/delete-problem/:id', authMiddleware, checkAdmin, deleteProblem)

problemsRoutes.get('/get-solved-problems', authMiddleware, getAllProblemsSolvedByUserId)

export default problemsRoutes;

