# Asikh Farm

This project is a project for Asikh Farms Main website

## Table of Contents

- [Application Overview](#application-overview)
- [Development Setup](#development-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Flow](#api-flow)
- [Deployment](#deployment)
  - [Local Docker Build](#local-docker-build)
  - [VPS Deployment](#vps-deployment)
  - [Netlify Deployment](#netlify-deployment)
- [SSL Certificate Management](#ssl-certificate-management)

## Application Overview

**Tech Stack:**

- **Frontend**: React with React Router
- **API**: Netlify Functions for serverless API calls to Shopify
- **State Management**: React hooks (useState, useEffect)
- **Styling**: Tailwind CSS

**Key Components:**

1. **OrderNow.js** - Main product display and checkout component
2. **proxy.js** - Netlify serverless function to interact with Shopify API
3. **api.js** - Frontend utility for API calls

## Development Setup

Follow these steps to set up the development environment:

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Asikh-Farm
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.template secrets/.env
   ```

   Edit the `secrets/.env` file with your Shopify API credentials and other required variables.

4. **Start the development server**

   For React development server with Netlify Functions:

   ```bash
   npm run dev
   ```

   This will start:

   - React app on port 3002
   - Netlify dev server on port 8888
   - Netlify Functions on port 8889

   Alternatively, to run only the React app:

   ```bash
   npm start
   ```

   To run only the Express server:

   ```bash
   npm run server
   ```

5. **Access the application**
   - Main app: http://localhost:8888
   - Direct React app: http://localhost:3002
   - API endpoint: http://localhost:8888/.netlify/functions/proxy

## Environment Variables

Create a `secrets/.env` file with the following variables:

```
# Shopify API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token

# React App Environment Variables (for local development)
REACT_APP_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# Vendor Settings
VENDOR_PIN=1234
VENDOR_NAME="Vendor Name"
VENDOR_CONTACT_NAME="Contact Person"
VENDOR_EMAIL=vendor@example.com
VENDOR_PHONE=+1234567890

# Twilio (for WhatsApp notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## Project Structure

- **`/src`**: React application source code
- **`/functions`**: Netlify serverless functions
  - **`proxy.js`**: Main API proxy for Shopify
  - **`products.js`**: Product listing endpoint
  - **`checkout.js`**: Checkout functionality
  - **`vendor-verify.js`**: Vendor verification
  - **`vendor-orders.js`**: Vendor order processing
- **`/public`**: Static assets
- **`/deploy`**: Deployment configuration and secrets
- **`server.js`**: Express server for local development and production
- **`dockerfile`**: Docker configuration for containerized deployment
- **`docker-entrypoint.sh`**: Container startup script

## API Flow

1. Frontend makes requests to `/api/proxy` (production) or `http://localhost:8888/.netlify/functions/proxy` (development)
2. Netlify redirects route these to the proxy.js serverless function
3. proxy.js calls Shopify API using the Shopify Storefront API
4. Data is transformed to match frontend expectations
5. Frontend displays products and handles checkout

## Deployment

### Local Docker Build

The recommended deployment strategy is to build Docker images locally and then deploy them to the VPS:

1. **Build the Docker image locally**

   ```bash
   docker build -t asikhfarm:latest --platform linux/amd64 .
   ```

2. **Save the Docker image to a tar file**

   ```bash
   docker save asikhfarm:latest > asikhfarm.tar
   ```

3. **Transfer the image to the VPS**

   ```bash
   scp asikhfarm.tar user@your-vps-ip:/path/to/deployment/
   ```

4. **Load the image on the VPS**

   ```bash
   ssh user@your-vps-ip
   cd /path/to/deployment/
   docker load < asikhfarm.tar
   ```

5. **Run the container on the VPS**
   ```bash
   docker run -d --name asikhfarm -p 5000:5000 --env-file /path/to/secrets/.env asikhfarm:latest
   ```

### VPS Deployment

The application is deployed at asikhfarms.in on a VPS running Ubuntu 24.04 LTS (x86_64 architecture).

1. **Configure Nginx as a reverse proxy**

   ```bash
   sudo nano /etc/nginx/sites-available/asikhfarm
   ```

   Add the following configuration:

   ```nginx
   server {
       listen 80;
       server_name asikhfarms.in www.asikhfarms.in;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Enable the site and restart Nginx**

   ```bash
   sudo ln -s /etc/nginx/sites-available/asikhfarm /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. **Set up SSL with Certbot**
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d asikhfarms.in -d www.asikhfarms.in
   ```

### Netlify Deployment

For Netlify deployment:

1. **Install Netlify CLI**

   ```bash
   npm install netlify-cli -g
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Deploy to Netlify**

   ```bash
   netlify deploy --prod
   ```

4. **Set environment variables in Netlify**
   Go to Netlify dashboard → Site settings → Environment variables and add all required variables from your `.env` file.

## SSL Certificate Management

### Nginx with Certbot

1. **Install Certbot**

   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate**

   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal**
   Certbot creates a cron job for automatic renewal. Verify with:
   ```bash
   sudo systemctl status certbot.timer
   ```

### HAProxy SSL Configuration

If using HAProxy instead of Nginx:

1. **Ensure Certbot is installed**

   ```bash
   certbot --version
   ```

2. **Use Certbot in standalone mode**

   ```bash
   sudo systemctl stop haproxy
   sudo certbot certonly --standalone -d yourdomain.com
   sudo systemctl start haproxy
   ```

3. **Update HAProxy configuration**

   ```bash
   sudo nano /etc/haproxy/haproxy.cfg
   ```

   Add:

   ```
   bind *:443 ssl crt /etc/letsencrypt/live/yourdomain.com/fullchain.pem
   ```

4. **Reload HAProxy**

   ```bash
   sudo systemctl reload haproxy
   ```

5. **Automate renewal**

   ```bash
   sudo crontab -e
   ```

   Add:

   ```
   0 0 * * * certbot renew --quiet && systemctl reload haproxy
   ```
