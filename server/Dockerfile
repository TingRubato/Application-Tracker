FROM node:16

ENV DB_USER=dbmasteruser \
    DB_PASSWORD="Gk{}0qxbMX{GghYR&Wr*GtJT#1;X|>t," \
    DB_HOST=ls-1c75e95833249c463cebc965c3b4f0ba33d690f2.clpgjfkqnq8g.us-east-2.rds.amazonaws.com \
    DB_PORT=5432 \
    DB_NAME=job_search_db \
    JWT_SECRET=DhgmLuC.2-Y!2fjzYs_x

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]