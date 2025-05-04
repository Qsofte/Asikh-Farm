#!/bin/bash
# Use an official Node.js LTS runtime as the base image with a specific version
# Using a specific digest for better security

FROM node:20.11.1-alpine3.19@sha256:2f46fd49c767554c089a5eb219115313b72748d8f62f5eccb58ef52bc36db4ab

# Set the working directory in the container
WORKDIR /AsikhFarm

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g serve

# Copy source code
COPY . .

# Copy the encryption/decryption scripts from secrets folder
COPY secrets/encrypt-env.js secrets/decrypt-env.js ./

# Make the entrypoint script executable
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 5000

# Set the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]