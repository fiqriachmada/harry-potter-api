import { Router } from 'express'
import { connection } from '../../apis/database.js'

const putUserById = Router()

putUserById.put('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const checkQueryUsername =
      'SELECT COUNT(*) as count FROM users WHERE username = ?'
    const checkQueryEmail =
      'SELECT COUNT(*) as count FROM users WHERE email = ?'

    const [checkRowsUsername] = await (
      await connection()
    ).query(checkQueryUsername, req.body.username)
    const [checkRowsEmail] = await (
      await connection()
    ).query(checkQueryEmail, req.body.email)

    const usernameTaken = checkRowsUsername[0].count > 0
    const emailTaken = checkRowsEmail[0].count > 0

    if (usernameTaken) {
      return res.status(400).json({ message: 'Use Different Username' })
    } else if (emailTaken) {
      return res.status(400).json({ message: 'Use Different Email' })
    }

    const userData = {
      ...req.body
    }

    const updateUserQuery = `UPDATE users SET ? WHERE id = ?`

    await (await connection()).query(updateUserQuery, [userData, id])

    const response = {
      status: res.statusCode,
      data: userData
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

export default putUserById
