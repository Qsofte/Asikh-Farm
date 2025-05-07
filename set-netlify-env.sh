#!/bin/bash
# set-netlify-env.sh - Script to set Netlify environment variables from .env file

# Check if .env file exists
ENV_FILE="./secrets/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: $ENV_FILE not found!"
  exit 1
fi

echo "=== Setting Netlify environment variables from $ENV_FILE ==="

# Get site ID (or let user select it)
SITE_ID=$(netlify api listSites | jq -r '.[] | select(.name | contains("asikh")) | .site_id')
if [ -z "$SITE_ID" ]; then
  echo "No site ID found with 'asikh' in the name."
  echo "Running 'netlify link' to select a site..."
  netlify link
  SITE_ID=$(netlify api listSites | jq -r '.[] | select(.site_id == "'$(cat .netlify/state.json | jq -r .siteId)'") | .site_id')
fi

echo "Using Netlify site ID: $SITE_ID"
echo ""

# Read .env file and set each variable in Netlify
while IFS= read -r line || [[ -n "$line" ]]; do
  # Skip comments and empty lines
  if [[ $line =~ ^#.*$ ]] || [[ -z $line ]]; then
    continue
  fi
  
  # Extract variable name and value
  if [[ $line =~ ^([A-Za-z0-9_]+)=(.*)$ ]]; then
    VAR_NAME="${BASH_REMATCH[1]}"
    VAR_VALUE="${BASH_REMATCH[2]}"
    
    # Remove quotes if present
    VAR_VALUE=$(echo "$VAR_VALUE" | sed -E 's/^"(.*)"$/\1/')
    VAR_VALUE=$(echo "$VAR_VALUE" | sed -E "s/^'(.*)'$/\1/")
    
    echo "Setting $VAR_NAME..."
    netlify env:set "$VAR_NAME" "$VAR_VALUE" --scope production
  fi
done < "$ENV_FILE"

echo ""
echo "=== Environment variables set successfully ==="
echo "You can verify them with: netlify env:list"
