import multer from 'multer';
import fs from 'fs';
import { Router } from 'express';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads'; // create a new directory called "uploads"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // set the filename to the original name of the file
  },
});

const upload = multer({ storage: storage });

const uploadImage = Router();

// define a route for handling file uploads
uploadImage.post('/upload', upload.single('filepond'), (req, res) => {
  console.log(req.file); // log the file data for debugging purposes
  res.send('File uploaded successfully!');
});

export default uploadImage;
