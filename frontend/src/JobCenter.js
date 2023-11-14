import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JobCenter.css';

const JobCenter = () => {
    const [appliedJobsCount, setAppliedJobsCount] = useState(0);
    const [unappliedJobsCount, setUnappliedJobsCount] = useState(0);
    const navigate = useNavigate(); // Initialize useNavigate hook



    const fetchAppliedJobsCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/applied-jobs-count`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.count;
        } catch (error) {
            console.error('Error fetching applied jobs count', error);
            return 0;
        }
    };

    const fetchUnappliedJobsCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/unapplied-jobs-count`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.count;
        } catch (error) {
            console.error('Error fetching unapplied jobs count', error);
            return 0;
        }
    };

    useEffect(() => {
        fetchAppliedJobsCount().then(count => setAppliedJobsCount(count));
        fetchUnappliedJobsCount().then(count => setUnappliedJobsCount(count));
    }, []);

    return (

        <div className="job-center-container">
            <div className="job-center-header">Your Job Center</div>
            <div className="dashboard">
                <iframe src="https://grafana.timburring.com/d-solo/yijzcNSIz/demo?orgId=1&from=1699749477943&to=1699922277943&panelId=4" width="650" height="200" frameborder="0" title='Grafana'></iframe>
            </div>

            <p>Jobs Applied: {appliedJobsCount}</p>
            <p>Jobs in Process (Not Applied): {unappliedJobsCount}</p>
            <div>
                <button onClick={() => navigate('/jobs')}>Job Listings</button> {/* Navigate to Job Listings */}
                <button onClick={() => navigate('/jobapplied')}>Applied Jobs</button>
                <button onClick={() => navigate('/userinfo')}>User Info</button>
            </div>
        </div>
    );
};

export default JobCenter;
