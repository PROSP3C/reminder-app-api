import { Router } from 'express'
import { generateToken, hashPassword, comparePassword } from '@/utils/auth'
import { errorResponse, successResponse } from '@/utils/response'
import { asyncHandler } from '@/utils/asyncHandler'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

// Example in-memory store for demo only
const users: { [email: string]: { password: string; createdAt: string } } = {}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, try again later' },
})

router.post(
  '/register',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parse = registerSchema.safeParse(req.body)
    if (!parse.success) {
      return res.status(400).json(errorResponse('Invalid input'))
    }

    const email = parse.data.email.trim().toLowerCase()
    const { password } = parse.data

    if (users[email]) {
      return res.status(409).json(errorResponse('User already exists'))
    }

    const hashed = await hashPassword(password)
    users[email] = { password: hashed, createdAt: new Date().toISOString() }

    return res.status(201).json(successResponse('User registered'))
  }),
)

router.post(
  '/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parse = loginSchema.safeParse(req.body)
    if (!parse.success) {
      return res.status(400).json(errorResponse('Invalid input'))
    }

    const email = parse.data.email.trim().toLowerCase()
    const { password } = parse.data

    const user = users[email]

    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'))
    }

    const match = await comparePassword(password, user.password)
    if (!match) {
      return res.status(401).json(errorResponse('Invalid credentials'))
    }

    const token = generateToken({ email })
    return res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })
  }),
)

export default router
