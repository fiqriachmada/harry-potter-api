import { Router } from 'express';
import { connection } from '../../apis/database.js';
import imageKitApi from '../../apis/imageKitApi.js';

const deleteCharacterById = Router();

deleteCharacterById.delete('/:id', async (req, res) => {
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

    // Delete the image from ImageKit using its URL
    if (imageId) {
      // const imageId = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      await imageKitApi.deleteFile(imageId);
    }

    // Delete the character record and the associated image record
    const deleteCharacterQuery = `DELETE FROM hp_character WHERE id = ?`;
    const [deleteCharacterResult] = await (
      await connection()
    ).query(deleteCharacterQuery, [id]);

    if (imageId) {
      const deleteImageQuery = `DELETE FROM hp_character_image WHERE id = ? OR character_id = ?`;
      await (await connection()).query(deleteImageQuery, [imageId, id]);
    }

    const response = {
      status: res.statusCode,
      data: selectRows[0],
      message: `${deleteCharacterResult.affectedRows} character(s) deleted`,
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default deleteCharacterById;
