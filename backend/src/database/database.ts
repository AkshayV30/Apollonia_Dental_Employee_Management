import * as mongodb from "mongodb";
import { Employee } from "../models/employee";

export const collections: {
  employees?: mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();

  const db = client.db("AlponiaDental_DB");
  await applySchemaValidation(db);

  const employeesCollection = db.collection<Employee>("employees");
  collections.employees = employeesCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will
// always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this
// blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "first_name",
        "last_name",
        "date_of_joining",
        "years_of_experience",
        "background_info",
      ],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: "string",
          description: "'_id' is required and must be a string",
        },
        first_name: {
          bsonType: "string",
          description: "'first_name' is required and must be a string",
        },
        last_name: {
          bsonType: "string",
          description: "'last_name' is required and must be a string",
        },
        date_of_joining: {
          bsonType: "string",
          pattern: "^(\\d{4})-(\\d{2})-(\\d{2})$", // Validates ISO date format (e.g., 2023-12-28)
          description:
            "'date_of_joining' is required, must be a string in ISO date format",
        },
        years_of_experience: {
          bsonType: "int",
          minimum: 0,
          description:
            "'years_of_experience' is required and must be a non-negative integer",
        },
        background_info: {
          bsonType: "string",
          description: "'background_info' is required and must be a string",
        },
      },
    },
  };

  // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db
    .command({
      collMod: "employees",
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("employees", { validator: jsonSchema });
      }
    });
}
