import { Router } from 'express';
import employeeRoutes from './modules/employees/employee.routes';
import patientRoutes from './modules/patients/patient.routes';
import authRoutes from './configs/auth/auth.routes';

const router = Router();

router.use('/employees', employeeRoutes);
router.use('/patients', patientRoutes);
router.use('/auth', authRoutes);

export default router;
