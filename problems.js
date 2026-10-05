import {Router} from 'express';import {getProblem,listProblems,seedProblems} from '../controllers/problemController.js';import {protect} from '../middleware/authMiddleware.js';
const r=Router();r.get('/',listProblems);r.get('/:slug',getProblem);r.post('/seed',protect,seedProblems);export default r;
