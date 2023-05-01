import { Router } from 'express'
import mysql from 'mysql2/promise'
import { connection } from '../../apis/database.js'

const getAllCharacter = Router()

getAllCharacter.get('/', async (req, res) => {
  try {
    const itemsPerPage = 10
    const page = parseInt(req.query.page) || 1 // use query parameter or default to 1
    const offset = (page - 1) * itemsPerPage

    const countQuery = 'SELECT COUNT(*) as count FROM hp_character'
    const dataQuery = `SELECT * FROM hp_character ORDER BY id DESC LIMIT ${itemsPerPage} OFFSET ${offset}`

    const [countResult] = await (await connection()).query(countQuery)
    const [dataResult] = await (await connection()).query(dataQuery)

    const totalCount = countResult[0].count

    const totalPages = Math.ceil(totalCount / itemsPerPage)

    const response = {
      status: res.statusCode,
      data: dataResult,
      meta: {
        pagination: {
          page: page,
          itemsPerPage: itemsPerPage,
          totalCount: totalCount,
          totalPages: totalPages,
          links: {
            ...(page < totalPages && {
              next: `https://api-harry-potter-app.cyclic.app/characters?page=${
                page + 1
              }`
            }),
            ...(page > 1 &&
              page <= totalPages && {
                previous: `https://api-harry-potter-app.cyclic.app/characters?page=${
                  page - 1
                }`
              })
          }
        }
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default getAllCharacter
