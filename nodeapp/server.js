const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());

// ---------------- DATABASE CONFIG ----------------
const dbConfig = {
  host: "database-3.c7mqa0oysclm.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "lakshmi123",
  database: "employee_db",
  waitForConnections: true,
  connectionLimit: 10,
};

let pool;

// ---------------- CONNECT DB ----------------
async function connectDB() {
  try {
    pool = await mysql.createPool(dbConfig);
    console.log("✅ MySQL Connected Successfully");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
}

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("Node API Working 🚀");
});

// ---------------- GET ALL EMPLOYEES ----------------
app.get("/node/employees", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    console.error("Query error:", err.message);
    res.status(500).json({ error: "DB Query Failed" });
  }
});

// ---------------- GET EMPLOYEE BY NAME ----------------
app.get("/node/employee", async (req, res) => {
  try {
    const name = req.query.name;

    const [rows] = await pool.query(
      "SELECT * FROM employees WHERE name = ?",
      [name]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
        data: null
      });
    }

    res.json({
      status: "success",
      message: "Employee found",
      data: rows
    });

  } catch (err) {
    console.error("Query error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Query failed",
      data: null
    });
  }
});

// ---------------- START SERVER ----------------
const PORT = 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Node Server running on port ${PORT}`);
});
