import { Router } from 'express';
import { connection } from '../../apis/database.js';
import multer from 'multer';
import path from 'path';
import imageKitApi from '../../apis/imageKit.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postCharacter = Router();

postCharacter.post('/', upload.single('image_url'), async (req, res) => {
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

    const characterData = {
      ...req.body,
      image_id: uploadResponse.fileId,
    };

    // Insert into hp_character table
    const characterQuery = `INSERT INTO hp_character SET ?`;
    const [characterResult] = await (
      await connection()
    ).query(characterQuery, characterData);
    const characterId = characterResult.insertId;
    console.log('characterId', characterId);

    const imageData = [
      characterId,
      uploadResponse.filePath,
      uploadResponse.fileId,
    ];
    const imageQuery = `INSERT INTO hp_character_image (character_id, image_url, image_id) VALUES (?, ?, ?)`;
    await (await connection()).query(imageQuery, imageData);

    console.log('uploadResponse.fileId', uploadResponse.fileId);

    const response = {
      status: res.statusCode,
      data: characterData,
      uploadResponse,
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response);
  } catch (error) {
    console.log(error.message);
    const response = {
      status: 500,
      message: 'Failed to insert character data',
      error: error.message,
    };
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json(response);
  }
});

export default postCharacter;
