import { Router } from 'express'
import { connection } from '../../apis/database.js'
import { randomUUID } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const postUser = Router()

const saltRounds = 10

postUser.post('/', async (req, res) => {
  const { username, email, password } = req.body

  const checkQueryUsername =
    'SELECT COUNT(*) as count FROM users WHERE username = ?'
  const checkQueryEmail = 'SELECT COUNT(*) as count FROM users WHERE email = ?'
  const [checkRowsUsername] = await (
    await connection()
  ).query(checkQueryUsername, [username])
  const [checkRowsEmail] = await (await connection()).query(checkQueryEmail, [email])
  console.log('checkRowsUsername', checkRowsUsername[0])
  console.log('checkRowsEmail', checkRowsEmail[0])
  const usernameTaken = checkRowsUsername[0].count > 0
  const emailTaken = checkRowsEmail[0].count > 0

  if (usernameTaken) {
    return res.status(400).json({ message: 'Username already taken' })
  } else if (emailTaken) {
    return res.status(400).json({ message: 'Email already taken' })
  }

  const id = uuidv4()

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Username, email and password are required' })
  } else if (!username) {
    return res.status(400).json({ message: 'Username is required' })
  } else if (username.length < 6) {
    return res
      .status(400)
      .json({ message: 'Username must be at least 6 characters' })
  } else if (!email) {
    return res.status(400).json({ message: 'E-mail is required' })
  } else if (!email.includes('@')) {
    return res.status(400).json({ message: 'Email must contain @' })
  } else if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  } else if (
    !/^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
  ) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters and contain at least one special character'
    })
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const query =
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)'
  const data = [id, username, email, hashedPassword]

  try {
    const [rows] = await (await connection()).query(query, data)

    const response = {
      status: res.statusCode,
      data: { id, username, email, password, hashedPassword }
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(response)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Error creating user' })
  }
})

export default postUser
