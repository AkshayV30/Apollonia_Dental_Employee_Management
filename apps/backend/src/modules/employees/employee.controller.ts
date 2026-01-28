// import { Request, Response } from 'express';
// import Employee from './employee.model';

// export const getEmployees = async (req: Request, res: Response) => {
//   const data = await Employee.find();
//   res.json(data);
// };

// export const addEmployee = async (req: Request, res: Response) => {
//   try {
//     const employee = new Employee(req.body);
//     await employee.save();
//     res.status(201).json(employee);
//   } catch (err: any) {
//     res.status(400).json({
//       error: 'Failed to add employee',
//       details: err.message,
//     });
//   }
// };

import Employee from './employee.model';
import { createCRUDController } from '../../utils/crud';

export const { getAll: getEmployees, create: addEmployee } = createCRUDController(Employee);
