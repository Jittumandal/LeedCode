import e from 'express';
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from '../controllers/playlist.controller.js';


const playlistRoutes = express.Router();

playlistRoutes.get('/', authMiddleware, getAllListDetails)

playlistRoutes.get('/:playlistId', authMiddleware, getPlayListDetails)

playlistRoutes.post('/createplaylist', authMiddleware, createPlaylist)

playlistRoutes.post('/:playlistId/addproblem', authMiddleware, addProblemToPlaylist)

playlistRoutes.delete('/:playlistId', authMiddleware, deletePlaylist)

playlistRoutes.delete('/:playlistId/removeproblem', authMiddleware, removeProblemFromPlaylist)


export default playlistRoutes
