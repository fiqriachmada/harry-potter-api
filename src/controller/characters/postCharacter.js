import { Router } from 'express'
import { connection } from '../../apis/database.js'
import imageKit from '../../apis/imageKit.js'
import multer from 'multer'
import path from 'path'

const postCharacter = Router()

postCharacter.post('/', async (req, res) => {
  const data = { ...req.body }

  const query = `INSERT INTO hp_character SET ?`
  try {
    const [rows] = await (await connection()).query(query, data)

    const response = {
      status: res.statusCode,
      data: data,
      rows
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(response)
  } catch (error) {
    console.log(error.message)
  }
})

export default postCharacter
