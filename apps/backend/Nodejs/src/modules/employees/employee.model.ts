import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_joining: Date,
  specialization: String,
  years_of_experience: Number,
  background_info: String,
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
});

export default mongoose.model("Employee", employeeSchema);
