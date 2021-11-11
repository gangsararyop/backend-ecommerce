require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createPool({
  port: 3306,
  connectionLimit: 10,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "backend_ecommerce",
});

connection.getConnection((err, conn) => {
  if (err) {
    console.log("Error Connecting : " + err.stack);
    conn.release();
    return;
  }

  console.log("Connected as id " + conn.threadId);
  conn.release();
});

module.exports = connection;
