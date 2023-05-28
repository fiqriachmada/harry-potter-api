// import { Router } from 'express'
// import { connection } from '../../apis/database.js'
// import bcrypt from 'bcrypt'
// import { authenticateToken } from '../../apis/authenticateToken.js'

// const getProfileUser = Router()

// getProfileUser.get('/', authenticateToken, async (req, res) => {
//   try {
//     const itemsPerPage = 10
//     const page = parseInt(req.query.page) || 1 // use query parameter or default to 1
//     const offset = (page - 1) * itemsPerPage
//     const userId = req.userId
//     // retrieve userId from the request object

//     const countQuery = 'SELECT COUNT(*) as count FROM users WHERE id = ?' // add WHERE clause to count only the logged-in user
//     const dataQuery = `SELECT * FROM users WHERE id = ? ORDER BY id DESC LIMIT ${itemsPerPage} OFFSET ${offset}` // add WHERE clause to retrieve data only for the logged-in user

//     const [countResult] = await (await connection()).query(countQuery, [userId]) // pass userId as a parameter to count query
//     const [dataResult] = await (await connection()).query(dataQuery, [userId]) // pass userId as a parameter to data query

//     const totalCount = countResult[0].count

//     const totalPages = Math.ceil(totalCount / itemsPerPage)

//     const response = {
//       status: res.statusCode,
//       data: dataResult,
//       meta: {
//         pagination: {
//           page: page,
//           itemsPerPage: itemsPerPage,
//           totalCount: totalCount,
//           totalPages: totalPages,
//           links: {
//             ...(page < totalPages && {
//               next: `https://api-harry-potter-app.cyclic.app/users?page=${
//                 page + 1
//               }`
//             }),
//             ...(page > 1 &&
//               page <= totalPages && {
//                 previous: `https://api-harry-potter-app.cyclic.app/users?page=${
//                   page - 1
//                 }`
//               })
//           }
//         }
//       }
//     }

//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.json(response)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: 'Internal server error' })
//   }
// })

// export default getProfileUser

import { Router } from 'express'
import mysql from 'mysql2/promise'
import { connection } from '../../apis/database.js'
import { authenticateToken } from '../../apis/authenticateToken.js'

const getAllUser = Router()

getAllUser.get('/', authenticateToken, async (req, res) => {
  try {
    const itemsPerPage = 10
    const page = parseInt(req.query.page) || 1 // use query parameter or default to 1
    const offset = (page - 1) * itemsPerPage

    const timeZoneOffset = '+07:00' // change this to your desired timezone offset

    const countQuery = 'SELECT COUNT(*) as count FROM users'
    const dataQuery = `
    SELECT id, username, email, created_at, updated_at FROM users
    ORDER BY users.updated_at DESC
    LIMIT ${itemsPerPage} OFFSET ${offset}`

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
          maxItemsPerPage: itemsPerPage,
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
                previous: `https://api-harry-potter-app.cyclic.app/users?page=${
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

export default getAllUser
