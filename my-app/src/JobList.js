import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/job-listings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJobs(response.data);
      } catch (err) {
        setError('Could not fetch jobs. Please try again later.');
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Job Listings</h2>
      {error && <p className="error">{error}</p>}
      {jobs.length ? (
        <ul>
          {jobs.map((job) => (
            // Wrap the job title in a Link component
            <li key={job.job_fccid}>
              <Link to={`/jobs/${job.job_fccid}`}>
                <h3>{job.job_title}</h3>
              </Link>
              <p><strong>Company:</strong> {job.company_name}</p>
              <p><strong>Location:</strong> {job.job_location}</p>
              <p><strong>Post Date:</strong> {new Date(job.post_date).toLocaleDateString()}</p>
              {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
              <p><strong>Type:</strong> {job.job_type}</p>
              <p><strong>Description:</strong> {job.job_description}</p>
              <a href={job.job_link} target="_blank" rel="noopener noreferrer">Job Link</a>
              {/* Add more fields as necessary */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No job listings available.</p>
      )}
    </div>
  );
}

export default JobList;
