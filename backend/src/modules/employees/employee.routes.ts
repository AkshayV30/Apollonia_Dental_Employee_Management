import { Router } from 'express';
import { getEmployees, addEmployee } from './employee.controller';

const router = Router();

router.get('/', getEmployees);
router.post('/', addEmployee);

export default router;
