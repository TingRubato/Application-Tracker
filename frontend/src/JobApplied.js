import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './JobApplied.css'; // Ensure you have the CSS file for styling

const JobApplied = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const jobsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(true);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        const fetchAppliedJobs = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/applied-jobs`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setAppliedJobs(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching applied jobs', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchAppliedJobs();
    }, []);

    // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentAppliedJobs = appliedJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = currentPage > 1;
  const nextPage = currentPage < Math.ceil(appliedJobs.length / jobsPerPage);

  // Calculate the number of page buttons to display based on screen width
  const pageButtonWidth = 42; // Assume each page button is approximately 40px wide
  const maxPageButtons = Math.floor(windowWidth / pageButtonWidth);

  // Calculate the start and end page numbers
  let startPage, endPage;
  const totalPage = Math.ceil(appliedJobs.length / jobsPerPage);
  if (totalPage <= maxPageButtons) {
    // Case 1: total pages is less than max, show all pages
    startPage = 1;
    endPage = totalPage;
  } else if (currentPage <= Math.floor(maxPageButtons / 2)) {
    // Case 2: current page is near the start, show first pages
    startPage = 1;
    endPage = maxPageButtons;
  } else if (currentPage + Math.floor(maxPageButtons / 2) >= totalPage) {
    // Case 3: current page is near the end, show last pages
    startPage = totalPage - maxPageButtons + 1;
    endPage = totalPage;
  } else {
    // Case 4: current page is somewhere in the middle, show pages around current
    startPage = currentPage - Math.floor(maxPageButtons / 2);
    endPage = startPage + maxPageButtons - 1;
  }
  
  // Generate the page buttons
  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button key={i} onClick={() => paginate(i)} className={`page-item ${currentPage === i ? 'active' : ''}`}>
        {i}
      </button>
    );
  }
    return (
        <div className="job-list">
            {isLoading ? (
                <div className="loading-indicator">
                    <p>Loading Applied Jobs...</p>
                </div>
            ) : (
                <div>
                    <h2>Applied Jobs</h2>
                    {error && <p className="error">{error}</p>}
                    {currentAppliedJobs.length > 0 ? (
                        <ul className="job-list">
                            {currentAppliedJobs.map(job => (
                                <li key={job.job_jk} className="job-item">
                                <Link to={`/jobs/${job.job_jk}`}>
                                  <h3>{job.job_title}</h3>
                                </Link>
                                    <p><strong>Job Link:</strong> <a href={job.job_link} target="_blank" rel="noopener noreferrer">{job.job_link}</a></p>
                                    <p><strong>Location:</strong> {job.company_location}</p>
                                    <p><strong>Salary:</strong> {job.salary}</p>
                                    <p><strong>Job Type:</strong> {job.job_type}</p>
                                    <p><strong>Description:</strong> {job.job_description.length > 350 ? job.job_description.substring(0, 150) + '...' : job.job_description}</p>
                                    <p><strong>Applied On:</strong> {new Date(job.applied_timestamp).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No jobs applied for yet.</p>
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

export default JobApplied;
