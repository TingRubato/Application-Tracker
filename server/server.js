require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Uncomment this after installing bcrypt
const path = require('path');

const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Set to true in production if your DB requires SSL
  }
});

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.use(express.static(path.join(__dirname, 'public')));

async function findUserByUsername(username) {
  // Replace the following with a query to your database
  const query = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await pool.query(query, [username]);
  return rows[0]; // Assuming username is unique and only one record will be returned
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Username or password incorrect' });
    }

    // Compare the hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Username or password incorrect' });
    }

    // User authenticated, create a token
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    res.json({ userId: newUser.rows[0].id, username: newUser.rows[0].username });
  } catch (err) {
    console.error('Error creating new user', err);
    res.status(500).send('Server error');
  }
});

app.post('/mark-applied', authenticateToken, async (req, res) => {
  const {
    jobId,
    jobLink,
    companyName,
    companyLocation,
    salary,
    jobType,
    jobDescription
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertQueryText = `
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

    const insertResult = await client.query(insertQueryText, [
      jobId,
      jobLink,
      companyName,
      companyLocation,
      salary,
      jobType,
      jobDescription
    ]);

    const updateQueryText = `
      UPDATE processed_jobs
      SET applied = TRUE
      WHERE id = $1;
    `;

    await client.query(updateQueryText, [jobId]);

    await client.query('COMMIT');

    res.json({ success: true, message: 'Job marked as applied.', job: insertResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database operation failed:', err.stack);
    res.status(500).json({ success: false, message: 'Database operation failed.' });
  } finally {
    client.release();
  }
});

app.get('/job-listings', authenticateToken, async (req, res) => {
  const locationFilter = req.query.locationFilter;

  try {
    let query = `
      SELECT * FROM processed_jobs
      WHERE applied = FALSE
    `;

    // If a location filter is provided and it's not 'ALL'
    if (locationFilter && locationFilter !== 'ALL') {
      // For 'Remote', match 'Remote' in job_location
      if (locationFilter === 'Remote') {
        query += ` AND location_keyword ILIKE '%Remote%'`;
      } else {
        // For state abbreviations, match them in job_location
        query += ` AND location_keyword ILIKE '%${locationFilter}%'`;
      }
    }

    query += ' ORDER BY scrap_time DESC';

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching job listings', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/check-applied/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    // Query to check if the job is marked as applied
    const queryText = 'SELECT COUNT(*) FROM applied_jobs WHERE job_id = $1';
    const result = await pool.query(queryText, [jobId]);

    // Check if the count is greater than 0
    const isApplied = parseInt(result.rows[0].count, 10) > 0;

    res.json({ applied: isApplied });
  } catch (err) {
    console.error('Error checking application status:', err);
    res.status(500).json({ success: false, message: 'Database operation failed.' });
  }
});

app.get('/applied-jobs', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM applied_jobs ORDER BY applied_timestamp ASC';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching job listings', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/job-listings/:job_jk', authenticateToken, async (req, res) => {
  console.log("Fetching job details for jk ID:", req.params.job_jk);
  try {
    const { job_jk } = req.params;
    const query = 'SELECT * FROM processed_jobs WHERE job_jk = $1';
    const { rows } = await pool.query(query, [job_jk]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Job not found.' });
    }
  } catch (err) {
    console.error('Error fetching job details', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/is-applied/:job_jk', authenticateToken, async (req, res) => {
  try {
    const { job_jk } = req.params;
    // Query to check if the job is applied by the user
    const query = `
      SELECT 1 FROM applied_jobs  WHERE job_jk = $1`;
    const { rows } = await pool.query(query, [job_jk]);

    // If rows array is not empty, job is applied
    const isApplied = rows.length > 0;

    res.json({ isApplied });
  } catch (err) {
    console.error('Error in checking applied job', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/applied-jobs-count', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) FROM applied_jobs';
    const { rows } = await pool.query(query);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching applied jobs count', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
