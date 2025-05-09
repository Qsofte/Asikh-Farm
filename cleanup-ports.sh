#!/bin/bash
# cleanup-ports.sh - Script to kill processes on ports 3000 and 5001

echo "=== Cleaning up ports 3000 and 5001 ==="

# Check and kill processes on port 3000 (React development server)
PORT_3000_PIDS=$(lsof -ti:3000)
if [ -n "$PORT_3000_PIDS" ]; then
  echo "Found processes on port 3000: $PORT_3000_PIDS"
  echo "Killing processes..."
  kill -9 $PORT_3000_PIDS
  echo "✅ Processes on port 3000 killed."
else
  echo "✅ No processes found on port 3000."
fi

# Check and kill processes on port 5001 (Express server)
PORT_5001_PIDS=$(lsof -ti:5001)
if [ -n "$PORT_5001_PIDS" ]; then
  echo "Found processes on port 5001: $PORT_5001_PIDS"
  echo "Killing processes..."
  kill -9 $PORT_5001_PIDS
  echo "✅ Processes on port 5001 killed."
else
  echo "✅ No processes found on port 5001."
fi

echo ""
echo "=== Port cleanup complete ==="
echo "You can now start your servers without port conflicts."
