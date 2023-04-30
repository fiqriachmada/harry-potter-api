import { Router } from 'express'
import mysql from 'mysql2/promise'
import getConnection from '../../database/database.js'

const connection = getConnection()

const characterController = Router()

characterController.get('/', async (req, res) => {
  const itemsPerPage = 10
  const page = parseInt(req.query.page) || 1 // use query parameter or default to 1
  const offset = (page - 1) * itemsPerPage
  const query = `SELECT * FROM hp_character LIMIT ${itemsPerPage} OFFSET ${offset} ORDER BY id DESC LIMIT`

  const [rows] = await (await connection).query(query)

  const response = {
    status: res.statusCode,
    data: rows,
    meta: {
      pagination: {
        page: page,
        itemsPerPage: itemsPerPage,
        links: {
          next: `https://api-harry-potter-app.cyclic.app/characters?page=${
            page + 1
          }`
        }
      }
    }
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(response)
})

export default characterController
