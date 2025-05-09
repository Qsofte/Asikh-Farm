#!/bin/bash
# debug-netlify.sh - Script to debug and fix Netlify routing issues

echo "=== Debugging Netlify Setup ==="

# 1. Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo "❌ Netlify CLI not found. Installing..."
  npm install -g netlify-cli
else
  echo "✅ Netlify CLI is installed."
  netlify --version
fi

# 2. Kill any existing processes on relevant ports
echo ""
echo "=== Checking for processes on ports 3000, 3001, 8888, 8889 ==="
for PORT in 3000 3001 8888 8889; do
  PORT_PIDS=$(lsof -ti:$PORT)
  if [ -n "$PORT_PIDS" ]; then
    echo "Found processes on port $PORT: $PORT_PIDS"
    echo "Killing processes..."
    kill -9 $PORT_PIDS
    echo "Processes killed."
  else
    echo "No processes found on port $PORT."
  fi
done

# 3. Check netlify.toml configuration
echo ""
echo "=== Checking netlify.toml configuration ==="
if grep -q "functions = \"functions\"" netlify.toml && grep -q "force = true" netlify.toml; then
  echo "✅ netlify.toml configuration looks good."
else
  echo "❌ netlify.toml configuration may need adjustments."
  echo "   Please ensure functions directory and force = true for API redirects are set."
fi

# 4. Check functions directory
echo ""
echo "=== Checking functions directory ==="
if [ -d "functions" ]; then
  echo "✅ functions directory exists."
  echo "Functions found:"
  ls -la functions/
else
  echo "❌ functions directory not found."
  echo "   Creating functions directory..."
  mkdir -p functions
fi

# 5. Test API endpoints
echo ""
echo "=== Testing API endpoints ==="
echo "Starting Netlify Functions server in the background..."
netlify functions:serve &
NETLIFY_PID=$!
sleep 5

echo "Testing products endpoint..."
curl -s http://localhost:8888/.netlify/functions/products | head -c 100
echo "..."

# Kill the background Netlify process
kill $NETLIFY_PID

echo ""
echo "=== Recommendations ==="
echo "1. Run 'netlify dev --debug' to see detailed logs"
echo "2. Check browser console for any API errors"
echo "3. Verify that your React app is making requests to the correct endpoints"
echo "4. Make sure your environment variables are properly set"

echo ""
echo "=== Starting Netlify Dev with Debug ==="
echo "Running: netlify dev --debug"
echo "Press Ctrl+C to stop"
