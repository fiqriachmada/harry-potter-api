import { Router } from 'express'
import mysql from 'mysql2/promise'
import { connection } from '../../apis/database.js'

const getCharacterById = Router()

getCharacterById.get('/:id', async (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM hp_character WHERE hp_character.id=?'
  const [rows] = await (await connection()).query(query, [id])

  const response = {
    status: res.statusCode,
    data: rows[0]
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(response)
})

export default getCharacterById
