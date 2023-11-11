# Stage 1 - Building the React App
FROM node:latest as build
ENV REACT_APP_API_URL=localhost:3000
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - Serving the React App with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8787
CMD ["nginx", "-g", "daemon off;"]
