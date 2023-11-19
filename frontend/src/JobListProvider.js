import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobListContext = createContext();

export function JobListProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
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
      } catch (err) {
        setError('Could not fetch jobs. Please try again later.');
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  const jobListContextValue = {
    jobs,
    error,
    isLoading,
  };

  return (
    <JobListContext.Provider value={jobListContextValue}>
      {children}
    </JobListContext.Provider>
  );
}

export function useJobList() {
  const context = useContext(JobListContext);
  if (!context) {
    throw new Error('useJobList must be used within a JobListProvider');
  }
  return context;
}

// export { JobListProvider, useJobList };
