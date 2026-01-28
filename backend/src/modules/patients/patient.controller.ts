// import { Request, Response } from 'express';
// import Patient from './patient.model';

// export const getPatients = async (req: Request, res: Response) => {
//   const patients = await Patient.find();
//   res.json(patients);
// };

// export const addPatient = async (req: Request, res: Response) => {
//   try {
//     const p = new Patient(req.body);
//     await p.save();
//     res.status(201).json(p);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };

import Patient from './patient.model';
import { createCRUDController } from '../../utils/crud';

export const { getAll: getPatients, create: addPatient } = createCRUDController(Patient);
