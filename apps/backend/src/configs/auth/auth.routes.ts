import { Router } from 'express';
import { signup, login, dashboard } from './auth.controller';
import auth from '../../middlewares/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/dashboard', auth, dashboard);

export default router;
