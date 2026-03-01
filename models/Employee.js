import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    adharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
)

const Employee = mongoose.model('Employee', employeeSchema)

export default Employee