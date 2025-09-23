import { Request, Response } from "express";
import Employee from "../models/employee.model";

export const getEmployees = async (req: Request, res: Response) => {
  const employees = await Employee.find();
  res.json(employees);
};

export const addEmployee = async (req: Request, res: Response) => {
  try {
    // req.body now includes nested objects
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res
      .status(400)
      .json({
        error: "Failed to add employee",
        details: (err as Error).message,
      });
  }
};
