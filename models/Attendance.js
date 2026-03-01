import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// one attendance per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

const Attendance = mongoose.model('Attendance', attendanceSchema)

export default Attendance