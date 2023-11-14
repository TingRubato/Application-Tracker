import React, { useState } from 'react';
import axios from 'axios';
import './UserInfo.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    workEmail: '',
    education: '',
    workExperience: [{ title: '', company: '', startTime: '', endTime: '', responsibilities: '' }],
    urls: { linkedIn: '', github: '' },
    jobPreferences: { jobTitlePreferred: ['', '', '', ''], jobLocationPreferred: ['', '', '', ''] }
  });

  const handleInputChange = (e, section, index) => {
    if (section === 'workExperience') {
      const newWorkExperiences = [...userInfo.workExperience];
      newWorkExperiences[index][e.target.name] = e.target.value;
      setUserInfo({ ...userInfo, workExperience: newWorkExperiences });
    } else if (section === 'jobPreferences') {
      const newPreferences = { ...userInfo.jobPreferences };
      newPreferences[e.target.name][index] = e.target.value;
      setUserInfo({ ...userInfo, jobPreferences: newPreferences });
    } else {
      setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }
  };

  const addWorkExperience = () => {
    setUserInfo({
      ...userInfo,
      workExperience: [...userInfo.workExperience, { title: '', company: '', startTime: '', endTime: '', responsibilities: '' }]
    });
  };

  const saveUserInfo = () => {
    // Replace with your backend URL
    axios.post('YOUR_BACKEND_ENDPOINT/userinfo', userInfo)
      .then(response => {
        console.log(response.data);
        alert('User info saved successfully!');
      })
      .catch(error => {
        console.error('There was an error saving the user info', error);
      });
  };

  return (
    <div>
      <h1>User Info</h1>
      <input name="name" value={userInfo.name} onChange={(e) => handleInputChange(e)} placeholder="Name" />
      <input name="address" value={userInfo.address} onChange={(e) => handleInputChange(e)} placeholder="Address" />
      <input name="phoneNumber" value={userInfo.phoneNumber} onChange={(e) => handleInputChange(e)} placeholder="Phone Number" />
      <input name="workEmail" value={userInfo.workEmail} onChange={(e) => handleInputChange(e)} placeholder="Work Email" />
      <input name="education" value={userInfo.education} onChange={(e) => handleInputChange(e)} placeholder="Education" />

      <h2>Work Experience</h2>
      {userInfo.workExperience.map((exp, index) => (
        <div key={index}>
          <input name="title" value={exp.title} onChange={(e) => handleInputChange(e, 'workExperience', index)} placeholder="Title" />
          <input name="company" value={exp.company} onChange={(e) => handleInputChange(e, 'workExperience', index)} placeholder="Company" />
          <input type="date" name="startTime" value={exp.startTime} onChange={(e) => handleInputChange(e, 'workExperience', index)} />
          <input type="date" name="endTime" value={exp.endTime} onChange={(e) => handleInputChange(e, 'workExperience', index)} />
          <input name="responsibilities" value={exp.responsibilities} onChange={(e) => handleInputChange(e, 'workExperience', index)} placeholder="Responsibilities" />
        </div>
      ))}
      <button onClick={addWorkExperience}>Add Work Experience</button>

      <h2>URLs</h2>
      <input name="linkedIn" value={userInfo.urls.linkedIn} onChange={(e) => handleInputChange(e)} placeholder="LinkedIn URL" />
      <input name="github" value={userInfo.urls.github} onChange={(e) => handleInputChange(e)} placeholder="GitHub URL" />

      <h1>Job Preferences</h1>
      <h2>Job Title Preferred</h2>
      {userInfo.jobPreferences.jobTitlePreferred.map((title, index) => (
        <input key={index} name="jobTitlePreferred" value={title} onChange={(e) => handleInputChange(e, 'jobPreferences', index)} placeholder={`Option ${index + 1}`} />
      ))}

      <h2>Job Location Preferred</h2>
      {userInfo.jobPreferences.jobLocationPreferred.map((location, index) => (
        <input key={index} name="jobLocationPreferred" value={location} onChange={(e) => handleInputChange(e, 'jobPreferences', index)} placeholder={`Option ${index + 1}`} />
      ))}

      <button onClick={saveUserInfo}>Save</button>
    </div>
  );
};

export default UserInfo;
