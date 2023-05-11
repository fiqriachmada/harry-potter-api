import { Router } from 'express';
import { connection } from '../../apis/database.js';
import multer from 'multer';
import imageKitApi from '../../apis/imageKitApi.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const putCharacterById = Router();

putCharacterById.put('/:id', upload.single('image_url'), async (req, res) => {
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

    const data = {
      ...req.body,
      image_url: uploadResponse.filePath,
      image_id: uploadResponse.fileId,
    };

    const updateCharacterQuery = `UPDATE hp_character
      SET full_name = ?, species = ?, gender = ?, house = ?, date_of_birth = ?, year_of_birth = ?, is_wizard = ?, ancestry = ?, eye_colour = ?, hair_colour = ?, wand_id = ?, patronus = ?, is_hogwarts_student = ?, is_hogwarts_staff = ?, is_alive = ?
      WHERE id = ?`;

    const updateImageQuery =
      'UPDATE hp_character_image SET image_url = ?, image_id = ? WHERE character_id = ?';

    const [characterResult] = await (
      await connection()
    ).query(updateCharacterQuery, [
      ...data,
      req.body.full_name,
      req.body.species,
      req.body.gender,
      req.body.house,
      req.body.date_of_birth,
      req.body.year_of_birth,
      req.body.is_wizard,
      req.body.ancestry,
      req.body.eye_colour,
      req.body.hair_colour,
      req.body.wand_id,
      req.body.patronus,
      req.body.is_hogwarts_student,
      req.body.is_hogwarts_staff,
      req.body.is_alive,
      req.params.id,
    ]);

    const [imageResult] = await (
      await connection()
    ).query(updateImageQuery, [data.image_url, data.image_id, req.params.id]);

    const response = {
      status: res.statusCode,
      data,
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
