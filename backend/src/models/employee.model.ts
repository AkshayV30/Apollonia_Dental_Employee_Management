import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  email: string;
  departmentId: mongoose.Types.ObjectId;
  phone?: string;
}

const employeeSchema: Schema<IEmployee> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    phone: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);
