#!/bin/sh
set -e

# Decrypt environment variables if .env.encrypted exists
if [ -f ".env.encrypted" ]; then
  echo "Decrypting environment variables..."
  node decrypt-env.js
  
  # Check if decryption was successful
  if [ $? -ne 0 ]; then
    echo "Warning: Failed to decrypt environment variables. Using defaults."
  else
    echo "Environment variables decrypted successfully."
  fi
fi

# Build the React app with the decrypted environment variables
echo "Building React application..."
npm run build

# Start the server
if [ -f "server.js" ]; then
  echo "Starting Node.js server..."
  exec node server.js
else
  echo "Starting static file server..."
  exec serve -s build -l 5000
fi
