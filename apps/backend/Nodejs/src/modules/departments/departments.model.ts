import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  department_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model("Department", departmentSchema);
