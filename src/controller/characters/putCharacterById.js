import { Router } from 'express';
import { connection } from '../../apis/database.js';
import imageKitApi from '../../apis/imageKit.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const putCharacterById = Router();

putCharacterById.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const fileData = req.file;
    const uploadResponse = await imageKitApi.upload({
      file: fileData.buffer,
      fileName: req.file.originalname,
      folder: 'character-harry-potter-api',
      extensions: [
        {
          name: 'google-auto-tagging',
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });

    const data = { ...req.body, image: uploadResponse.filePath };

    const query = 'UPDATE hp_character SET ? WHERE id = ?';
    const [result] = await (
      await connection()
    ).query(query, [data, req.params.id]);

    const response = { status: res.statusCode, data: data, result };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

export default putCharacterById;
