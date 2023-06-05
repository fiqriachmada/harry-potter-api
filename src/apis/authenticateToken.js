import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const secretKey = process.env.SECRET_KEY

export function authenticateToken (req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'User not found' })
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid User' })
    }

    req.userId = decoded.id
    next()
  })
}
