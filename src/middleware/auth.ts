import { AuthedRequest, AuthRequest, User } from '@/routes/types'
import { UnauthorizedError } from '@/utils/errors'
import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): asserts req is AuthedRequest => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ error: 'Missing Authorization header' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const user = jwt.verify(token, JWT_SECRET) as User

    if (!user.id) {
      throw new UnauthorizedError('Not authorized')
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return
  }
}
