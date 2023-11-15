# Use a specific Node.js version
FROM node:16

# Install PM2 globally
RUN npm install pm2 -g

# Set environment variables
ARG DB_USER
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG JWT_SECRET
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_API_KEY

ENV DB_USER=$DB_USER \
    DB_PASSWORD=$DB_PASSWORD \
    DB_HOST=$DB_HOST \
    DB_PORT=$DB_PORT \
    DB_NAME=$DB_NAME \
    JWT_SECRET=$JWT_SECRET \
    REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_GOOGLE_API_KEY=$REACT_APP_GOOGLE_API_KEY

# Copy and install server dependencies
WORKDIR /usr/src/app/server
COPY server/package*.json ./
RUN npm ci

# Copy server code
COPY server/ .

# Copy and install frontend dependencies
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend code
COPY frontend/ .

# Expose the ports for frontend and backend
EXPOSE 3000 3001

# Add a start-up script to run PM2
COPY start-app.sh .
RUN chmod +x start-app.sh

# Start the application with PM2
CMD ["./start-app.sh"]
