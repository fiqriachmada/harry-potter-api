import { Router } from 'express';
import { connection } from '../../apis/database.js';
import multer from 'multer';

import { v4 as uuidv4 } from 'uuid';
import imageKitApi from '../../apis/imageKitApi.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postCharacter = Router();

postCharacter.post(
  '/',
  upload.single('image_url' || 'filepond'),
  async (req, res) => {
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

      const idCharacter = uuidv4();

      const characterData = {
        ...req.body,
        id: idCharacter,
        image_id: uploadResponse.fileId,
      };

      // Insert into hp_character table
      const characterQuery = `INSERT INTO hp_character SET ?`;
      const [characterResult] = await (
        await connection()
      ).query(characterQuery, characterData);
      const characterId = characterData.id;

      const imageData = {
        id: uploadResponse.fileId,
        character_id: characterId,
        image_url: uploadResponse.filePath,
      };

      const imageQuery = `INSERT INTO hp_character_image SET ?`;
      const [imageResult] = await (
        await connection()
      ).query(imageQuery, imageData);

      const response = {
        status: res.statusCode,
        data: { ...characterData, ...imageData },
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
  }
);

export default postCharacter;
