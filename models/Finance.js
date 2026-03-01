import mongoose from 'mongoose'

const financeSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true, // example: salary, product sale, rent
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    remark: {
      type: String,
      default: '',
      trim: true,
    },
    amountType: {
      type: String,
      enum: ['expense', 'revenue'],
      required: true,
    },
  },
  { timestamps: true }
)

const Finance = mongoose.model('Finance', financeSchema)

export default Finance