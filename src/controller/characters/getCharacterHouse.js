import { Router } from 'express'
import getConnection from '../../database/database.js'

const getCharacterHouse = Router()

const connection = getConnection()

getCharacterHouse.get('/', async (req, res) => {
  const query = `SELECT DISTINCT house FROM hp_character`

  const [rows] = await (await connection).query(query)

  const response = {
    status: res.statusCode,
    data: rows
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(response)
})

export default getCharacterHouse
