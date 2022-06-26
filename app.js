import express from 'express'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import cors from 'cors'
import bodyParser from 'body-parser'

dotenv.config()

const connection = await mysql.createConnection(process.env.DATABASE_URL)
console.log('The Database is connected to ' + process.env.DATABASE_URL + '\n')

const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ msg: 'Hello World' })
})

let status = 200
let returnValue = {}

app.get('/characters', async (req, res) => {
  const query = 'SELECT * FROM hp_character'
  const [rows] = await connection.query(query)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(rows)
  console.log(rows)
})

app.get('/characters/:id', async (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM hp_character WHERE hp_character.id=?'
  const [rows] = await connection.query(query, [id])

  if (!rows[0]) {
    return res.json({ msg: "Couldn't find that character" })
  }
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(rows[0])
  console.log(rows[0])
})

app.post('/characters/', async (req, res) => {
  const data = { ...req.body }

  const query = 'INSERT INTO hp_character SET ?'

  const [rows] = await connection.query(query, data)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(rows)
  console.log(rows)
})

app.put('/characters/:id', async (req, res) => {
  const data = { ...req.body }

  const query = 'UPDATE hp_character SET ? WHERE id = ' + req.params.id

  const [rows] = await connection.query(query, data, req.params.id)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(rows)
  console.log(rows)
})

app.get('/wands', async (req, res) => {
  const query = 'SELECT * FROM wand'
  const [rows] = await connection.query(query)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(rows)
})

app.get('/wands/:id', async (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM wand WHERE wand.id=?'
  const [rows] = await connection.query(query, [id])

  if (!rows[0]) {
    return res.json({ msg: "Couldn't find that character" })
  }
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(rows[0])
})

const port = 3000

app.listen(port, () => {
  console.log('App is Listening...and the server is up to port ' + port)
})

// const listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port)
// })}
