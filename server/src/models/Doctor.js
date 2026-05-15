import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const availabilitySchema = new Schema({
  day: {
    type: String, // "Monday", "Tuesday", ...
    required: true
  },
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true }    // e.g. "17:00"
});

const doctorSchema = new Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  email: String,
  phone: String,
  location: String,
  weeklyAvailability: [availabilitySchema] // Array of availability per day
});

export default model('Doctor', doctorSchema);
