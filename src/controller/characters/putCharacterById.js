// import { Router } from 'express'
// import mysql from 'mysql2/promise'
// import { connection } from '../../apis/database.js'

// const putCharacterById = Router()

// putCharacterById.put('/:id', async (req, res) => {
//   // const response = {
//   //   status: res.statusCode,
//   //   data: rows,
//   //   meta: {
//   //     pagination: {
//   //       page: page,
//   //       itemsPerPage: itemsPerPage,
//   //       links: {
//   //         next: `https://api-harry-potter-app.cyclic.app/characters?page=${
//   //           page + 1
//   //         }`
//   //       }
//   //     }
//   //   }
//   // }
//   const data = { ...req.body }

//   const query = 'UPDATE hp_character SET ? WHERE id = ' + req.params.id

//   const [rows] = await (await connection()).query(query, data, req.params.id)

//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.json(data)
//   res.json(rows);
//   console.log('Updated on ' + JSON.stringify(data))
//   console.log(rows)

//   // res.setHeader('Access-Control-Allow-Origin', '*')
//   // res.json(response)
// })

// export default putCharacterById

import { Router } from 'express'
import mysql from 'mysql2/promise'
import { connection } from '../../apis/database.js'

const putCharacterById = Router()

putCharacterById.put('/:id', async (req, res) => {
  const data = { ...req.body }
  const query = 'UPDATE hp_character SET ? WHERE id = ' + req.params.id
  const [rows] = await (await connection()).query(query, data, req.params.id)

  res.setHeader('Access-Control-Allow-Origin', '*')
  const response = { status: res.statusCode, data: data, rows }
  res.json(response)
})

export default putCharacterById
