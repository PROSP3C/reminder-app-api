import { Pool } from 'pg'

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === 'production'
      ? process.env.DATABASE_URL
      : (import.meta as any).env.VITE_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export default pool
