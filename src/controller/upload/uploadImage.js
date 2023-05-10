import multer from 'multer';
import { Router } from 'express';
import { connection } from '../../apis/database.js';

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadImage = Router();

uploadImage.post('/upload', upload.single('filepond'), async (req, res) => {
  try {
    const data = {
      ...req.body,

      fileData: req.file.buffer,
      name: req.file.originalname,
      mimetype: req.file.mimetype,

      path: '/path/to/file',

      size: req.file.size,
    };

    const query = `INSERT INTO files SET ?`;

    const [results] = await (await connection()).query(query, data);

    const response = {
      status: res.statusCode,
      data,
    };

    console.log(`File uploaded to MySQL with ID ${results.insertId}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


export default uploadImage;
