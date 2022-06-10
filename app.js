import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
console.log("The Database is connected to\n" + connection);

const app = express();

app.get("/", (req, res) => {
  res.json({ msg: "Hello World" });
});

let status = 200;
let returnValue = {};

app.get("/characters", async (req, res) => {
  try {
    const query = "SELECT * FROM hp_character";
    const [rows] = await connection.query(query);
    returnValue.data = rows;
  } catch (error) {
    console.log(error);
    status = 500;
    returnValue.msg = "Something went wrong";
  } finally {
    res.status(status).json(returnValue);
  }
});

app.get("/characters/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM hp_character WHERE hp_character.id=?";
  const [rows] = await connection.query(query, [id]);

  if (!rows[0]) {
    return res.json({ msg: "Couldn't find that character" });
  }
  res.json(rows[0]);
});

app.get("/wands", async (req, res) => {
  const query = "SELECT * FROM wand";
  const [rows] = await connection.query(query);
  res.send(rows);
});

app.get("/wands/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM wand WHERE wand.id=?";
  const [rows] = await connection.query(query, [id]);

  if (!rows[0]) {
    return res.json({ msg: "Couldn't find that character" });
  }
  res.json(rows[0]);
});

app.listen(3000, () => {
  console.log("App is Listening...and the server is up\n");
});
