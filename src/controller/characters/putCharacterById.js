import { Router } from 'express';
import { connection } from '../../apis/database.js';
import multer from 'multer';
import imageKitApi from '../../apis/imageKitApi.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const putCharacterById = Router();

putCharacterById.put('/:id', upload.single('image_url'), async (req, res) => {
  const { id } = req.params;

  try {
    // Get the character record and the associated image URL
    const selectQuery = `SELECT hp_character.*, hp_character_image.image_url, hp_character_image.id FROM hp_character LEFT JOIN hp_character_image ON hp_character.image_id = hp_character_image.id WHERE hp_character.id=?`;
    const [selectRows] = await (await connection()).query(selectQuery, [id]);

    if (selectRows.length === 0) {
      // If the character record doesn't exist, return an error response
      res.status(404).json({ error: 'Character not found' });
      return;
    }

    const imageId = selectRows[0].id;

    console.log('imageId', imageId);

    // Delete the image from ImageKit using its URL
    if (imageId) {
      await imageKitApi.deleteFile(imageId, function (error, result) {
        if (error) console.log(error);
        else console.log(result);
      });
    }

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

    const characterData = {
      ...req.body,
      image_id: uploadResponse.fileId,
    };

    const updateCharacterQuery = `UPDATE hp_character SET ? WHERE id = ?`;

    const [characterResult] = await (
      await connection()
    ).query(updateCharacterQuery, [characterData, id]);

    const imageData = {
      id: uploadResponse.fileId,
      image_url: uploadResponse.filePath,
    };

    const updateImageQuery =
      'UPDATE hp_character_image SET ? WHERE character_id = ?';

    const [imageResult] = await (
      await connection()
    ).query(updateImageQuery, [imageData, id]);

    const response = {
      status: res.statusCode,
      characterData,
      imageData,
      characterResult,
      imageResult,
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

export default putCharacterById;
