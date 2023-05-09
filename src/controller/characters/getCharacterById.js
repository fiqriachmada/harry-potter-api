import { Router } from 'express';
import mysql from 'mysql2/promise';
import { connection } from '../../apis/database.js';

const getCharacterById = Router();

getCharacterById.get('/:id', async (req, res) => {
  const { id } = req.params;

  const timeZoneOffset = '+07:00'; // change this to your desired timezone offset

  const query = `SELECT *, 
    DATE_FORMAT(CONVERT_TZ(hp_character.created_at, '+00:00', '${timeZoneOffset}'), '%Y-%m-%d %H:%i:%s') as created_at,
    DATE_FORMAT(CONVERT_TZ(hp_character.updated_at, '+00:00', '${timeZoneOffset}'), '%Y-%m-%d %H:%i:%s') as updated_at FROM hp_character WHERE hp_character.id=?`;
  const [rows] = await (await connection()).query(query, [id]);

  const response = {
    status: res.statusCode,
    data: rows[0],
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(response);
});

export default getCharacterById;
