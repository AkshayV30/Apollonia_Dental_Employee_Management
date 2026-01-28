import { Router } from 'express';
import { getPatients, addPatient } from './patient.controller';

const router = Router();
router.get('/', getPatients);
router.post('/', addPatient);

export default router;
