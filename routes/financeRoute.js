import express from 'express'
import Finance from '../models/Finance.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// ✅ Add expense or revenue
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { date, type, amount, remark, amountType } = req.body

    // validation
    if (!date || !type || !amount || !amountType) {
      return res.status(400).json({
        success: false,
        message: 'date, type, amount and amountType are required',
      })
    }

    if (!['expense', 'revenue'].includes(amountType)) {
      return res.status(400).json({
        success: false,
        message: 'amountType must be expense or revenue',
      })
    }

    const finance = await Finance.create({
      date,
      type,
      amount,
      remark,
      amountType,
    })

    res.status(201).json({
      success: true,
      message: `${amountType} added successfully`,
      finance,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ✅ Finance report
router.get('/report', authMiddleware, async (req, res) => {
  try {
    const { amountType, month, year, today } = req.query

    // ================= VALIDATE TYPE =================
    if (amountType && !['expense', 'revenue'].includes(amountType)) {
      return res.status(400).json({
        success: false,
        message: 'amountType must be expense or revenue',
      })
    }

    // ================= BASE FILTER =================
    let filter = {}

    if (amountType) {
      filter.amountType = amountType
    }

    // ================= TODAY FILTER =================
    const todayDate = new Date()
    const startOfToday = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate()
    )
    const endOfToday = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate(),
      23,
      59,
      59
    )

    let todayData = []

    if (today === 'true') {
      const todayFilter = {
        ...filter,
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }

      todayData = await Finance.find(todayFilter).sort({ date: -1 })
    }

    // ================= MONTH/YEAR FILTER =================
    // const currentDate = new Date()
    // const selectedMonth = month ? Number(month) - 1 : currentDate.getMonth()
    // const selectedYear = year ? Number(year) : currentDate.getFullYear()

    // const startDate = new Date(selectedYear, selectedMonth, 1)
    // const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59)

    // const totalFilter = {
    //   ...filter,
    //   date: {
    //     $gte: startDate,
    //     $lte: endDate,
    //   },
    // }

    // const data = await Finance.find(totalFilter).sort({ date: -1 })

    // // ================= TOTAL AMOUNT =================
    // const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)
    // ================= DATE FILTER LOGIC =================
const currentDate = new Date()

let startDate
let endDate
let selectedMonth = null
let selectedYear = null

// ✅ CASE 1: month + year → specific month
if (month && year) {
  selectedMonth = Number(month) - 1
  selectedYear = Number(year)

  startDate = new Date(selectedYear, selectedMonth, 1)
  endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59)
}

// ✅ CASE 2: only year → whole year
else if (!month && year) {
  selectedYear = Number(year)

  startDate = new Date(selectedYear, 0, 1)
  endDate = new Date(selectedYear, 11, 31, 23, 59, 59)
}

// ✅ CASE 3: default → current month
else {
  selectedMonth = currentDate.getMonth()
  selectedYear = currentDate.getFullYear()

  startDate = new Date(selectedYear, selectedMonth, 1)
  endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59)
}

const totalFilter = {
  ...filter,
  date: {
    $gte: startDate,
    $lte: endDate,
  },
}

const data = await Finance.find(totalFilter).sort({ date: -1 })

const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)

    res.json({
      success: true,
      todayData,
      data,
      totalAmount,
      month: selectedMonth + 1,
      year: selectedYear,
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