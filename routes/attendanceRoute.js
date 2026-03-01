import express from 'express'
import Employee from '../models/Employee.js'
import Attendance from '../models/Attendance.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// helper → today date
const getToday = () => {
  return new Date().toISOString().split('T')[0]
}

// ✅ Mark attendance by phone number
router.post('/mark', authMiddleware, async (req, res) => {
  try {
    const { phoneNumber } = req.body

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      })
    }

    // find employee
    const employee = await Employee.findOne({ phoneNumber })

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      })
    }

    const today = getToday()

    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    })

    // 🟢 CHECK-IN
    if (!attendance) {
      attendance = await Attendance.create({
        employeeId: employee._id,
        phoneNumber,
        date: today,
        checkIn: new Date(),
      })

      return res.json({
        success: true,
        type: 'CHECK_IN',
        message: 'Check-in marked successfully',
        attendance,
      })
    }

    // 🔴 CHECK-OUT
    if (attendance && !attendance.checkOut) {
      attendance.checkOut = new Date()
      await attendance.save()

      return res.json({
        success: true,
        type: 'CHECK_OUT',
        message: 'Check-out marked successfully',
        attendance,
      })
    }

    // ❌ Already completed
    return res.status(400).json({
      success: false,
      message: 'Attendance already completed for today',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ✅ Get attendance report
router.get('/report', authMiddleware, async (req, res) => {
    console.log('Generating attendance report with filters:', req.query)
  try {
    const { month, year, employeeId } = req.query

    const today = new Date().toISOString().split('T')[0]

    // ================= TODAY ATTENDANCE =================
    const todayAttendance = await Attendance.find({ date: today })
      .populate('employeeId', 'name phoneNumber speciality')
      .sort({ createdAt: -1 })

    // ================= MONTH FILTER =================
    let filter = {}

    if (year) {
      const selectedMonth = month ? Number(month) - 1 : 0
      const selectedYear = Number(year)

      const startDate = new Date(selectedYear, selectedMonth, 1)
      const endDate = month
        ? new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59)
        : new Date(selectedYear, 11, 31, 23, 59, 59)

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      }
    }

    if (employeeId) {
      filter.employeeId = employeeId
    }

    // ================= TOTAL DATA =================
    const data = await Attendance.find(filter)
      .populate('employeeId', 'name phoneNumber speciality')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      todayAttendance,
      data,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

export default router