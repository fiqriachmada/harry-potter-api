import express from 'express'
import dotenv from 'dotenv'

import cors from 'cors'
import bodyParser from 'body-parser'
import getCharacterSpecies from './src/controller/characters/getCharacterSpecies.js'
import getCharacterHouse from './src/controller/characters/getCharacterHouse.js'
import { connection } from './src/apis/database.js'
import getCharacterById from './src/controller/characters/getCharacterById.js'
import getAllCharacter from './src/controller/characters/getAllCharacter.js'
import putCharacterById from './src/controller/characters/putCharacterById.js'
import postCharacter from './src/controller/characters/postCharacter.js'
import postUser from './src/controller/users/postUser.js'
import loginUser from './src/controller/users/loginUser.js'

import uploadImage from './src/controller/upload/uploadImage.js'
import deleteCharacterById from './src/controller/characters/deleteCharacterById.js'
import getAllUser from './src/controller/users/getAllUser.js'

dotenv.config()

const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ message: 'Harry Potter API' })
})

app.use('/characters', getAllCharacter)

app.use('/characters', putCharacterById)

app.use('/characters', postCharacter)

app.use('/characters', getCharacterById)

app.use('/characters', putCharacterById)

app.use('/characters', putCharacterById)

app.use('/characters', deleteCharacterById)

app.use('/species', getCharacterSpecies)

app.use('/house', getCharacterHouse)

app.use('/users', postUser)

app.use('/users', loginUser)

app.use('/users', getAllUser)

app.use('/', uploadImage)

app.get('/wands', async (req, res) => {
  const query = 'SELECT * FROM wand'
  const [rows] = await connection().query(query)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(rows)
})

app.get('/wands/:id', async (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM wand WHERE wand.id=?'
  const [rows] = await (await connection()).query(query, [id])

  if (!rows[0]) {
    return res.json({ msg: "Couldn't find that character" })
  }
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(rows[0])
})

const port = 5001

app.listen(port, () => {
  console.log(
    'App is Listening...and the server is up to port http://localhost:' + port
  )
})

// const listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
