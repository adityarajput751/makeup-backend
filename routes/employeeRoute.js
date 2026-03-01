import express from 'express'
import Employee from '../models/Employee.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// ✅ Add Employee (Protected)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, phoneNumber, address, adharNumber, speciality, isActive } = req.body

    // validation
    if (!name || !phoneNumber || !address || !adharNumber || !speciality || isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    // check duplicate adhar
    const existingEmp = await Employee.findOne({ adharNumber })
    if (existingEmp) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this Aadhar already exists',
      })
    }

    const employee = await Employee.create({
      name,
      phoneNumber,
      address,
      adharNumber,
      speciality,
      isActive,
    })

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ✅ Get all employees
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      count: employees.length,
      employees,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ✅ Update employee
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, phoneNumber, address, adharNumber, speciality } = req.body

    const employee = await Employee.findById(id)

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      })
    }

    // 🔒 check duplicate aadhar (if changed)
    if (adharNumber && adharNumber !== employee.adharNumber) {
      const existingEmp = await Employee.findOne({ adharNumber })
      if (existingEmp) {
        return res.status(400).json({
          success: false,
          message: 'Another employee already has this Aadhar',
        })
      }
    }

    // update fields
    employee.name = name ?? employee.name
    employee.phoneNumber = phoneNumber ?? employee.phoneNumber
    employee.address = address ?? employee.address
    employee.adharNumber = adharNumber ?? employee.adharNumber
    employee.speciality = speciality ?? employee.speciality

    await employee.save()

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ✅ Update employee active status
router.patch('/toggle-active/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { isActive } = req.body

    // validate
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be true or false',
      })
    }

    const employee = await Employee.findById(id)

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      })
    }

    employee.isActive = isActive
    await employee.save()

    res.json({
      success: true,
      message: `Employee ${isActive ? 'activated' : 'deactivated'} successfully`,
      employee,
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