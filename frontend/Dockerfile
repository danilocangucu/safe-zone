# Stage 1: Build the Angular application
FROM node:slim as build

WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the package.json and package-lock.json (if available)
COPY package*.json /app/

# Install all the dependencies
RUN npm install

# Copy the project files into the Docker image
COPY . /app

# Build the project
RUN ng build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the SSL certificate and private key files
COPY localhost.crt /etc/nginx/ssl/localhost.crt
COPY localhost.key /etc/nginx/ssl/localhost.key

# Change the permissions of the files
RUN chmod 600 /etc/nginx/ssl/localhost.crt /etc/nginx/ssl/localhost.key

# Expose port 1443
EXPOSE 1443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
