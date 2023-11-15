# Your all in one Job Application Center

<!-- PROJECT LOGO -->
<br />
<p align="center">
    <a href="">
        <img src="https://i.pinimg.com/736x/3f/cb/de/3fcbdeb47bc8cbef5c56874c4eedd3a2.jpg" alt="Logo" width="250" height="250">
    </a>

<div align="center">
<h3 align="center">Get me the job</h3>

  <p align="center">
    A simple Node.js application designed for easier access to a personalized job database and tracks job applications.
    <!-- <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p> -->
</div>

## About the project

<div align="left">
      <a href="https://www.youtube.com/watch?v=sttJykk34j8">
         <img src="http://img.youtube.com/vi/sttJykk34j8/0.jpg" style="width:100%;">
      </a>
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

This project is a simple Node.js application designed for easier access to a personalized job database and tracks job applications. It offers a user-friendly interface and efficient management tools to help job seekers keep track of their applications. This is still under development by someone who just started learning javascript and node.js 3 days ago so use it at your own risk.

## Features
- Job postings visualization
- Job application logging and tracking
- User authentication and profile management

## Getting Started
To set up the environment for development and testing, first, clone the repository. Then, navigate to both the frontend and server directories and run `npm install` to install necessary dependencies. Next, configure the .env file as needed. To launch the server, execute `node server.js`. Finally, switch to the frontend directory and start the application with `npm start`.

There are two .env file need, one for the frontend and one for the server. In the frontend .env file, you will need to specify the following variables:
- REACT_APP_API_URL: the URL of the server
- REACT_APP_GOOGLE_CLIENT_ID: the Google client ID for Google OAuth

In the server .env file, you will need to specify the following variables:
- DB_HOST: the host of the database
- DB_PORT: the port of the database
- DB_USER: the username of the database
- DB_PASSWORD: the password of the database
- DB_NAME: the name of the database
- JWT_SECRET: the secret key for JWT

## Troubleshooting

If you failed to login even if your credentials are correct, check your browser console to see if it's related to CORS. If so, you will need to configure your server to allow CORS. If you are using Express, you can use the cors package. But usually you will be able to run it without any problem if you are running the frontend and server on the same machine.

Due to the JWT authentication, your credentials may not work if you are accessing the application from a different machine. To solve this problem, you will need to change the JWT_SECRET variable in the server .env file to a new secret key and restart the server. Then, you will need to update the REACT_APP_API_URL variable in the frontend .env file to the new URL of the server and restart the frontend. Finally, you will need to register a new account and use the new credentials to login.

## Known Issues
- The pagination buttons in the job postings page are not working properly.
- The application retrieves all job postings from the database at once when loading the job postings page, which can lead to performance issues when there are a large number of job postings in the database. And pagination error might be caused by this.
- The application does not support multiple users yet even though I provided a register page, which is for testing purpose only.
- JWT Authentication is not working properly when accessing the application from a different machine.

## Contact
If you have any questions or suggestions, please feel free to contact me at **NOWHERE** because I am probably busy doing job hunting. Why would you think that I tried to learn javascript and build this application in the first place? 

I am just an electrical engineer who was supposed to do more things in embedded system, but the job market turned me down so many times and I had to look for another way out. So here I started with JavaScript, but I don't even know what I am doing. I am just trying to get a job.But if you are interested in this project, you can still contact me at ting.x@wustl.edu

## License
This project is released under the GPL-3.0 license, which grants users the freedom to modify and redistribute the software under the same license.
