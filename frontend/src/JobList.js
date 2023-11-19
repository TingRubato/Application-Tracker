import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './JobList.css';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/job-listings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        setError('Could not fetch jobs. Please try again later.');
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  // Function to apply the filter when button is clicked
  const applyFilter = () => {
    const filtered = locationFilter === 'ALL' ? jobs : jobs.filter(job => {
      return job.job_location.includes(locationFilter) || job.job_location.includes('Remote');
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);  // Resetting to the first page after applying filter
  };

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = currentPage > 1;
  const nextPage = currentPage < Math.ceil(filteredJobs.length / jobsPerPage);
  const totalPage = Math.ceil(filteredJobs.length / jobsPerPage);

  // Pagination buttons logic
  let startPage, endPage;
  const maxPageButtons = 10;
  if (totalPage <= maxPageButtons) {
    startPage = 1;
    endPage = totalPage;
  } else {
    const halfMax = Math.floor(maxPageButtons / 2);
    if (currentPage <= halfMax) {
      startPage = 1;
      endPage = maxPageButtons;
    } else if (currentPage + halfMax >= totalPage) {
      startPage = totalPage - maxPageButtons + 1;
      endPage = totalPage;
    } else {
      startPage = currentPage - halfMax;
      endPage = currentPage + halfMax;
    }
  }

  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button key={i} onClick={() => paginate(i)} className={`page-item ${currentPage === i ? 'active' : ''}`}>
        {i}
      </button>
    );
  }

  // Location options
  const locationOptions = ["ALL", "Remote", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

  return (
    <div className="job-list">
      <div className="filter-controls">
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          {locationOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button onClick={applyFilter}>Apply Filter</button>
      </div>

      {isLoading ? (
        <div className="loading-indicator">
          <p>Loading Jobs...</p>
        </div>
      ) : (
        <div>
          <h2>Job Listings</h2>
          {error && <p className="error">{error}</p>}
          {currentJobs.length ? (
            <ul className="job-listing">
              {currentJobs.map((job) => (
                <li key={job.job_jk} className="job-item">
                  <Link to={`/jobs/${job.job_jk}`}>
                    <h3>{job.job_title}</h3>
                  </Link>
                  <p><strong>Company:</strong> {job.company_name}</p>
                  <p><strong>Location:</strong> {job.job_location}</p>
                  <p><strong>Post Date:</strong> {new Date(job.post_date).toLocaleDateString()}</p>
                  {job.salary && <p><strong>Salary:</strong> {job.salary.toLocaleString()}</p>}
                  <p><strong>Type:</strong> {job.job_type}</p>
                  <p><strong>Description:</strong> {job.job_description.length > 150 ? job.job_description.substring(0, 150) + '...' : job.job_description}</p>
                  <a href={job.job_link} target="_blank" rel="noopener noreferrer">Job Link</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No job listings available.</p>
          )}
          <div className="pagination">
            {prevPage && <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>}
            {pageButtons}
            {nextPage && <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobList;
