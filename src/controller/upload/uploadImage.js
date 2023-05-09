import express from 'express';
import { Router } from 'express';

// configure multer middleware to handle file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // set the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // set the filename to the original name of the file
  },
});
const upload = multer({ storage: storage });

const uploadImage = Router();

// define a route for handling file uploads
uploadImage.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file); // log the file data for debugging purposes
  res.send('File uploaded successfully!');
});

export default uploadImage;
