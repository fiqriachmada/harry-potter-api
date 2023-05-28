import { Router } from 'express'
import { connection } from '../../apis/database.js'

const getUserById = Router()

getUserById.get('/:id', async (req, res) => {
  const { id } = req.params

  const timeZoneOffset = '+07:00' // change this to your desired timezone offset
  try {
    // hp_character.*, hp_character_image.image_url,
    const query = `SELECT id, username, email
    DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '${timeZoneOffset}'), '%Y-%m-%d %H:%i:%s') as created_at,
    DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '${timeZoneOffset}'), '%Y-%m-%d %H:%i:%s') as updated_at
    FROM users WHERE users.id= ?
    `
    // LEFT JOIN hp_character_image ON hp_character.image_id = hp_character_image.id WHERE hp_character.id=?
    const [rows] = await (await connection()).query(query, [id])

    const response = {
      status: res.statusCode,
      data: rows[0]
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default getUserById
