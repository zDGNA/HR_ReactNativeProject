const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hrd",
});

app.get("/employee", (req, res) => {
  connection.query("SELECT * FROM employee", (e, data) => {
    if (e) {
      return res.status(500).json({ message: "Error Database" });
    }
    res.status(200).json({ data });
  });
});

app.listen(3000, () => {
  console.log("Server API berjalan di http://localhost:3000");
});
