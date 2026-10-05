import {Router} from 'express';import {history,submit} from '../controllers/submissionController.js';import {protect} from '../middleware/authMiddleware.js';
const r=Router();r.post('/',protect,submit);r.get('/history',protect,history);export default r;
