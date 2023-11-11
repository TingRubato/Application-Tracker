FROM node:16

ENV DB_USER=I AM \
    DB_PASSWORD="Absolutely" \
    DB_HOST=a retard \
    DB_PORT=2345 \
    DB_NAME=nomore \
    JWT_SECRET=compromise

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
