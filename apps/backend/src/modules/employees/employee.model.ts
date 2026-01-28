import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employee_id: String,
  first_name: String,
  last_name: String,
  date_of_joining: Date,
  specialization: String,
  department_id: String,
  years_of_experience: Number,
  background_info: String,
});

export default mongoose.model('Employee', employeeSchema);
