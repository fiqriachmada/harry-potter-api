import { Router } from 'express';
import { connection } from '../../apis/database.js';
import imageKitApi from '../../apis/imageKit.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const putCharacterById = Router();

putCharacterById.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      filePath: req.body.image, // the existing file path
      file: fileData.buffer, // the new file buffer
      fileName: req.file.originalname, // the new file name
      folder: 'harry-potter-api', // the folder where the new file will be uploaded
      tags: ['harry-potter', 'character'], // optional tags to be associated with the new file
      useUniqueFileName: true, // optional flag to use a unique file name
    };
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

    const updateResponse = await imageKitApi.updateFileDetails() 

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
