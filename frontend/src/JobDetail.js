import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './JobDetail.css';
import { useMemo } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';


function JobDetail() {

  const { job_jk } = useParams();
  const [job, setJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('Not Applied');
  
  
  // const defaultCenter = { lat: 38.624691, lng: -90.184776 };


  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/job-listings/${job_jk}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      }
    };

    fetchJobDetail();
  }, [job_jk]);

  // Define the parseLocation function here
  const parseLocation = (locationString) => {
    if (!locationString) return null;
    const coordinates = locationString.match(/POINT\((.+)\s(.+)\)/);
    if (!coordinates) return null;
    return {
      lat: parseFloat(coordinates[2]),
      lng: parseFloat(coordinates[1])
    };
  };
  // Calculate location based on job data
  const location = job ? parseLocation(job.job_location) : null;

  // useMemo is now at the top level and not conditional
  const center = useMemo(() => location || { lat: 38.624691, lng: -90.184776 }, [location]);


  const handleApplyClick = () => {
    if (job && job.job_link) {
      window.open(job.job_link, '_blank');
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const handleMarkAsApplied = async () => {
    if (!job) return;

    const jobApplication = {
      jobId: job.id,
      jobLink: job.job_link,
      companyName: job.company_name,
      companyLocation: job.job_location,
      salary: job.salary || 'Not provided',
      jobType: job.job_type,
      jobDescription: job.job_description
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/mark-applied`, jobApplication, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setApplicationStatus('Applied');
      } else {
        setApplicationStatus('Failed to mark as applied');
      }
    } catch (err) {
      console.error('Error marking job as applied:', err);
      setApplicationStatus('Failed to mark as applied');
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-detail">
      <div className="job-info">
        <h2>{job.job_title}</h2>
        <p><strong>Company:</strong> {job.company_name}</p>
        <p><strong>Link:</strong> <a href={job.job_link} target="_blank" rel="noopener noreferrer">{job.job_link}</a></p>
        <p><strong>Location:</strong> {job.job_location}</p>
        <p><strong>Post Date:</strong> {new Date(job.post_date).toLocaleDateString()}</p>
        {job.salary && <p><strong>Salary:</strong> {job.salary.toLocaleString()}</p>}
        <p><strong>Type:</strong> {job.job_type}</p>
        <p><strong>Description:</strong> {job.job_description}</p>
        <button onClick={handleApplyClick}>Apply</button>
        <button onClick={handleMarkAsApplied}>{applicationStatus}</button>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
      <div className="App">
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={location || center}
            zoom={10}
          >
            {location && <Marker position={location} />}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

export default JobDetail;
