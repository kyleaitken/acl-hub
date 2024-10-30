# Specify the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Serve the React app
# CMD ["npx", "serve", "-s", "build"]

# Run the app
CMD ["npm", "run", "dev"]