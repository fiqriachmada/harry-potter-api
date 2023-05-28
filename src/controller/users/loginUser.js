import { Router } from 'express'
import { connection } from '../../apis/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const loginUser = Router()

loginUser.post('/login', async (req, res) => {
  const { username, email, password } = req.body

  const secretKey = process.env.SECRET_KEY

  try {
    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ message: 'Username or email, and password are required' })
    }

    let query, data
    if (username) {
      query = 'SELECT * FROM users WHERE username = ?'
      data = [username]
    } else if (email) {
      query = 'SELECT * FROM users WHERE email = ?'
      data = [email]
    }

    const [rows] = await (await connection()).query(query, data)
    const user = rows[0]

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid username or email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid username or email or password' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      secretKey,
      { expiresIn: '1h' }
    )

    const response = {
      status: res.statusCode,
      data: { id: user.id, username: user.username, email: user.email, token }
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default loginUser
