#!/bin/bash
# Use an official Node.js LTS runtime as the base image

FROM node:20-alpine

# Set the working directory in the container
WORKDIR /AsikhFarm

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g serve

# Copy source code
COPY . .

# Copy the encryption/decryption scripts (these will be created by the user)
COPY encrypt-env.js decrypt-env.js ./

# Make the entrypoint script executable
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 5000

# Set the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]