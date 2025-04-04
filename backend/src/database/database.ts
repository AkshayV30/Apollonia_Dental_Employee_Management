import * as mongodb from "mongodb";
import { Employee } from "../models/employee.model";
import { applySchemaValidation } from "./schemaValidation";

export const collections: {
  employees?: mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);

  await client.connect();

  const db = client.db("AlponiaDental_DB");
  await applySchemaValidation(db);

  collections.employees = db.collection<Employee>("employees");

  console.log("Connected to MongoDB");

  // client.on("close", () => {
  //   console.error("MongoDB connection closed. Attempting reconnect...");
  //   setTimeout(() => connectToDatabase(uri), 5000);
  // });
}
