import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getAllSubmissions, getAllTheSubmissionForProblem, getSubmissionsForProblem } from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();

submissionRoutes.get('/getallsubmissions', authMiddleware, getAllSubmissions)
submissionRoutes.get('/getsubmissions/:problemId', authMiddleware, getSubmissionsForProblem)
submissionRoutes.get('/getsubmissionscont/:problemId', authMiddleware, getAllTheSubmissionForProblem)



export default submissionRoutes;