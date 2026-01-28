import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patient_id: String,
  patient_name: String,
  patient_image: String,
  treatment_notes: String,
});

export default mongoose.model('Patient', patientSchema);
