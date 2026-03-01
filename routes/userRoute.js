import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// ✅ Register User API
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    // validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    // check existing user
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      })
    }

    // 🔐 hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await User.create({
      username,
      password: hashedPassword,
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: user._id,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// 🔐 Login User
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    // check user exists
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // 🎟️ create JWT token (1 hour)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      accessToken: token,
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