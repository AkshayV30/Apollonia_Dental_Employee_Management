import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Employee from "../modules/employees/employee.model";
import Department from "../modules/departments/departments.model";
import { CONFIG } from "../configs/env";

dotenv.config();

async function seed() {
  try {
    const dbUri = CONFIG.MONGO_LOCAL || CONFIG.MONGO_ATLAS;
    if (!dbUri) throw new Error("Mongo URI not defined in ENV");

    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ MongoDB connected for seeding");

    // Check if any data already exists
    const existingDepartments = await Department.countDocuments();
    const existingEmployees = await Employee.countDocuments();

    if (existingDepartments > 0 || existingEmployees > 0) {
      console.log(
        "⚠️ Data already exists. Seed aborted to prevent duplicates.",
      );
      process.exit(0);
    }

    // Load JSON data
    const dataPath = path.join(__dirname, "initialData.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const { departments, employees, employee_departments } =
      JSON.parse(rawData);

    // Insert Departments
    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ Inserted ${createdDepartments.length} departments`);

    // Insert Employees
    const createdEmployees = await Employee.insertMany(employees);
    console.log(`✅ Inserted ${createdEmployees.length} employees`);

    // Link Employees to Departments
    for (const link of employee_departments) {
      const employee = await Employee.findOne({
        employee_id: link.employee_id,
      });
      const department = await Department.findOne({
        department_id: link.department_id,
      });

      if (!employee || !department) continue;

      if (!employee.departments) employee.departments = [];
      employee.departments.push(department._id);
      await employee.save();
    }

    console.log(`✅ Linked employees to departments`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
