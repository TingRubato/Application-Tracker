# This Dockerfile sets up a Node.js environment for a React application.
# It installs the necessary dependencies specified in package.json, copies the application source code,
# and exposes port 3000 for the application to run on.
# The environment variables REACT_APP_GOOGLE_API_KEY and REACT_APP_API_URL are also set.
# To build the image, run: docker build -t <image-name> .
# To run the container, run: docker run -p 3000:3000 <image-name>

# Use an official Node.js runtime as a parent image
FROM node:18.15

# Set the working directory in the container to /app
WORKDIR /app
ARG REACT_APP_GOOGLE_API_KEY
ARG REACT_APP_API_URL

# Set environment variables
ENV REACT_APP_GOOGLE_API_KEY=$REACT_APP_GOOGLE_API_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]