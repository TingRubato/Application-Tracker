#!/bin/bash

# Start the backend server
cd /usr/src/app/server
pm2 start npm --name backend -- start

# Start the frontend
cd /usr/src/app/frontend
pm2 start npm --name frontend -- start

# Keep the container running
pm2 logs
