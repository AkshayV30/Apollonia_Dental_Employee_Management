import { Request, Response } from "express";
import Employee from "../models/employee.model";

export const getEmployees = async (req: Request, res: Response) => {
  const employees = await Employee.find();
  res.json(employees);
};

export const addEmployee = async (req: Request, res: Response) => {
  const newEmployee = new Employee(req.body);
  await newEmployee.save();
  res.status(201).json(newEmployee);
};
