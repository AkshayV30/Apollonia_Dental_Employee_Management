import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database/database";

// import Joi from "joi";

export const employeeRouter = express.Router();
// employeeRouter.use(express.json());

// Define validation schema using Joi
// const employeeSchema = Joi.object({
//   first_name: Joi.string().required(),
//   last_name: Joi.string().required(),
//   date_of_joining: Joi.string().isoDate().required(),
//   years_of_experience: Joi.number().integer().min(0).required(),
//   background_info: Joi.string().required(),
// });

/** Get all employees */
employeeRouter.get("/", async (_req, res) => {
  try {
    const employees = await collections?.employees?.find({}).toArray();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/** Get an employee by ID */
employeeRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const employee = await collections?.employees?.findOne(query);

    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: `Employee not found: ID ${id}` });
    }
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid ID format",
    });
  }
});

/** Create a new employee */
employeeRouter.post("/", async (req, res) => {
  try {
    const employee = req.body;

    if (
      !employee.first_name ||
      !employee.last_name ||
      !employee.date_of_joining
    ) {
      res.status(400).json({
        message:
          "Missing required fields: first_name, last_name, date_of_joining",
      });
      return;
    }

    const result = await collections?.employees?.insertOne(employee);

    if (result?.acknowledged) {
      res
        .status(201)
        .json({ message: `Created a new employee: ID ${result.insertedId}` });
    } else {
      res.status(500).json({ message: "Failed to create a new employee." });
    }
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/** Update an employee by ID */
employeeRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const employee = req.body;
    const query = { _id: new ObjectId(id) };

    const result = await collections?.employees?.updateOne(query, {
      $set: employee,
    });

    if (result && result.matchedCount) {
      res.status(200).json({ message: `Updated an employee: ID ${id}` });
    } else if (!result?.matchedCount) {
      res.status(404).json({ message: `Employee not found: ID ${id}` });
    } else {
      res.status(304).json({ message: `Failed to update employee: ID ${id}` });
    }
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/** Delete an employee by ID */
employeeRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await collections?.employees?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).json({ message: `Removed employee: ID ${id}` });
    } else if (!result) {
      res.status(400).json({ message: `Failed to remove employee: ID ${id}` });
    } else {
      res.status(404).json({ message: `Employee not found: ID ${id}` });
    }
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/** Add an employee to a department */
employeeRouter.post("/:id/departments", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { departmentId } = req.body;

    if (!departmentId) {
      res.status(400).json({ message: "Missing departmentId in request body" });
      return;
    }

    const employeeQuery = { _id: new ObjectId(employeeId) };

    // Add department reference (if needed)
    const result = await collections?.employees?.updateOne(employeeQuery, {
      $addToSet: { departments: departmentId },
    });

    if (result && result.modifiedCount) {
      res.status(200).json({
        message: `Added employee ${employeeId} to department ${departmentId}`,
      });
    } else {
      res.status(404).json({ message: `Employee or department not found` });
    }
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/** Get all departments of an employee */
employeeRouter.get("/:id/departments", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employeeQuery = { _id: new ObjectId(employeeId) };

    const employee = await collections?.employees?.findOne(employeeQuery);

    if (employee && employee.departments) {
      res.status(200).json({ departments: employee.departments });
    } else {
      res.status(404).json({
        message: `Employee or departments not found: ID ${employeeId}`,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
