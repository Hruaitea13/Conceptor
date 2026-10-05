import {Router} from 'express';
import {dashboard,knowledge} from '../controllers/progressController.js';
import {protect} from '../middleware/authMiddleware.js';
const r=Router();
r.get('/dashboard',protect,dashboard);
r.get('/knowledge',protect,knowledge);
export default r;
