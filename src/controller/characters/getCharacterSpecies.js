import { Router } from 'express'
import getConnection from '../../database/database.js'

const getCharacterSpecies = Router()

const connection = getConnection()

getCharacterSpecies.get('/', async (req, res) => {
  const query = `SELECT DISTINCT species FROM hp_character`

  const [rows] = await (await connection).query(query)

  const response = {
    status: res.statusCode,
    data: rows,
    // meta: {
    //   pagination: {
    //     page: page,
    //     itemsPerPage: itemsPerPage,
    //     links: {
    //       next: `https://api-harry-potter-app.cyclic.app/characters?page=${
    //         page + 1
    //       }`
    //     }
    //   }
    // }
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(response)
})

export default getCharacterSpecies
