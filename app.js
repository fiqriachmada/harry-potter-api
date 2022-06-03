import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);


const app = express();

app.get("/", (req, res) => {
  res.json({ msg: "Hello World" });
});

app.get("/characters", async (req, res) => {
  const query = "SELECT * FROM hp_character";
  const [rows] = await connection.query(query);
  res.send(rows);
});

app.get("/wands", async (req, res) => {
  const query = "SELECT * FROM wand";
  const [rows] = await connection.query(query);
  res.send(rows);
});

app.listen(3000, () => {
  console.log("App is Listening...and the server is up\n");
});
