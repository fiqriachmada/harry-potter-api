// db.js

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

export default async function getConnection () {
  console.log('Database is Connected to', databaseUrl + '\n')
  return await mysql.createConnection(process.env.DATABASE_URL)
}
