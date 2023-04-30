import { Router } from 'express'
import { connection } from '../../apis/database.js'

export const getCharacterSpecies = Router()

getCharacterSpecies.get('/', async (req, res) => {
  const query = `SELECT DISTINCT species FROM hp_character`

  const [rows] = await (await connection()).query(query)

  const response = {
    status: res.statusCode,
    data: rows
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(response)
})

export default getCharacterSpecies