import express from 'express'
import type { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express + TypeScript!')
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
