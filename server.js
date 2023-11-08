// server.js

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
    require: false
  }
});


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/mark-applied', async (req, res) => {
  // Destructure the data sent from the client
  const {
    jobId,
    jobLink,
    companyName,
    companyLocation,
    salary,
    jobType,
    jobDescription
  } = req.body;

  try {
    // SQL query to insert a new record into the 'applied_jobs' table
    const queryText = `
      INSERT INTO applied_jobs (
        job_id, 
        job_link, 
        company_name, 
        company_location, 
        salary, 
        job_type, 
        job_description,
        applied_timestamp
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;

    // Execute the query using the data from the client
    const result = await pool.query(queryText, [
      jobId,
      jobLink,
      companyName,
      companyLocation,
      salary,
      jobType,
      jobDescription
    ]);

    // Send a JSON response back to the client including the inserted record
    res.json({ success: true, message: 'Job marked as applied.', job: result.rows[0] });
  } catch (err) {
    console.error('Database operation failed:', err.stack);
    // Send an error response back to the client
    console.log('Database user:', process.env.DB_USER);
    console.log('Database host:', process.env.DB_HOST);
    console.log('Database name:', process.env.DB_NAME);
    console.log('Database password:', process.env.DB_PASSWORD); // Be cautious about printing passwords in logs
    console.log('Database port:', process.env.DB_PORT);

    res.status(500).json({ success: false, message: 'Database operation failed.', error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
