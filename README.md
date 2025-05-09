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
- **Notifications**: Twilio WhatsApp integration
- **Deployment**: Docker containerization, Nginx reverse proxy

**Key Components:**

1. **OrderNow.js** - Main product display and checkout component
2. **proxy.js** - Netlify serverless function to interact with Shopify API
3. **api.js** - Frontend utility for API calls
4. **server.js** - Express server for production deployment
5. **vendor-orders.js** - Handles bulk ordering for vendors

## Feature Descriptions

### 1. Product Catalog

**Description:** Displays farm products fetched from Shopify with details and pricing.

**Implementation Details:**
- Uses Shopify Storefront API GraphQL queries to fetch product data
- Transforms complex Shopify response into simplified product objects
- Handles image optimization and responsive display
- Implements error handling for API failures

**Code Example (GraphQL Query):**
```graphql
query {
  products(first: 50) {
    edges {
      node {
        id title description
        images(first: 1) { edges { node { src } } }
        variants(first: 10) { edges { node { id title priceV2 { amount currencyCode } } } }
      }
    }
  }
}
```

### 2. Shopping Cart & Checkout

**Description:** Enables customers to add products to cart and complete checkout via Shopify.

**Implementation Details:**
- Integrates with Shopify Cart API (replacing deprecated Checkout API)
- Creates cart with selected products and quantities
- Redirects to Shopify-hosted checkout for payment processing
- Handles cart creation errors and validation

**Key Features:**
- Quantity selection for products
- Price calculation
- Seamless redirect to secure Shopify checkout
- Error handling and validation

### 3. Vendor Portal

**Description:** Secure area for vendors to place bulk orders with special pricing.

**Implementation Details:**
- PIN-based authentication system for vendors
- Custom order form for bulk purchases
- Direct creation of orders in Shopify via Admin API
- WhatsApp notifications for new orders via Twilio

**Security Measures:**
- Server-side PIN validation
- Environment variable storage of credentials
- Input validation and sanitization

### 4. WhatsApp Notifications

**Description:** Real-time order notifications sent via WhatsApp to vendors and administrators.

**Implementation Details:**
- Twilio WhatsApp API integration
- Formatted messages with order details
- Fallback mechanisms for notification failures
- Phone number validation and formatting

### 5. Multi-Environment Support

**Description:** Application runs seamlessly in development, staging, and production environments.

**Implementation Details:**
- Environment-specific configuration via .env files
- Conditional API endpoint selection based on environment
- Development server with hot reloading
- Production-optimized builds

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

## Integration Architecture

### System Overview

```
+----------------+     +-------------------+     +------------------+
|                |     |                   |     |                  |
|  React Frontend+---->+ Netlify Functions +---->+ Shopify API      |
|                |     | / Express Server  |     |                  |
+-------+--------+     +--------+----------+     +------------------+
        |                       |
        |                       |                 +------------------+
        |                       |                 |                  |
        |                       +---------------->+ Twilio API       |
        |                                         | (WhatsApp)       |
        |                                         +------------------+
        |
        |                       +------------------+
        |                       |                  |
        +---------------------->+ Browser Checkout |
                                | (Shopify)        |
                                +------------------+
```

### Data Flow

1. **Product Listing:**
   - Frontend requests product data from Netlify Functions/Express Server
   - Server queries Shopify Storefront API using GraphQL
   - Server transforms data and returns to frontend
   - Frontend renders product listings

2. **Checkout Process:**
   - Customer selects products and initiates checkout
   - Frontend sends checkout request to server
   - Server creates a cart using Shopify Cart API
   - Server returns checkout URL to frontend
   - Frontend redirects customer to Shopify-hosted checkout page

3. **Vendor Orders:**
   - Vendor authenticates using PIN
   - Vendor submits bulk order through vendor interface
   - Server validates order details
   - Server creates order in Shopify using Admin API
   - Server sends WhatsApp notification via Twilio
   - Order confirmation displayed to vendor

### Twilio Integration

The application uses Twilio to send WhatsApp notifications for new vendor orders. This integration works as follows:

```
+----------------+     +-------------------+     +------------------+
|                |     |                   |     |                  |
| Vendor Order   +---->+ Server            +---->+ Shopify Order    |
| Submission     |     | Processing        |     | Creation         |
+----------------+     +--------+----------+     +------------------+
                                |
                                |
                                v
                       +------------------+     +------------------+
                       |                  |     |                  |
                       | Twilio Client    +---->+ WhatsApp Message |
                       | Initialization   |     | to Vendor       |
                       +------------------+     +------------------+
```

**Twilio Configuration:**

1. The server initializes the Twilio client using credentials from environment variables:
   ```javascript
   const twilioClient = require('twilio')(
     process.env.TWILIO_ACCOUNT_SID,
     process.env.TWILIO_AUTH_TOKEN
   );
   ```

2. When a vendor order is created, the server sends a WhatsApp notification:
   ```javascript
   const twilioMessage = await twilioClient.messages.create({
     body: `Your Asikh Farm order was received! New Bulk Order #${orderName} from ${vendor} for ${quantity} boxes. Delivery on ${deliveryDate}. Contact: ${contactName}, ${email}`,
     from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
     to: `whatsapp:${formattedPhone}`
   });
   ```

3. The notification includes:
   - Order number
   - Vendor name
   - Quantity ordered
   - Delivery date
   - Contact information

4. Error handling is implemented to manage notification failures gracefully:
   ```javascript
   try {
     // Send WhatsApp notification
   } catch (twilioError) {
     console.error('Twilio notification error:', twilioError.message);
     notificationError = twilioError.message;
   }
   ```

## Deployment

### Local Docker Build

The recommended deployment strategy is to build Docker images locally and then deploy them to the VPS:

1. **Build the Docker image locally**

   ```bash
   docker build -t asikhfarm:latest --platform linux/amd64 .
   ```

   This builds a cross-platform image compatible with the x86_64 architecture of the VPS.

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

### Docker Deployment Details

**Dockerfile Explanation:**

The Dockerfile is configured to create a production-ready image:

```dockerfile
# Use Node.js LTS with specific digest for security
FROM node:20.11.1-alpine3.19@sha256:2f46fd49c767554c089a5eb219115313b72748d8f62f5eccb58ef52bc36db4ab

# Set working directory
WORKDIR /AsikhFarm

# Copy package files for better caching
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g serve

# Copy source code
COPY . .

# Make entrypoint executable
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 5000

# Set entrypoint
ENTRYPOINT ["./docker-entrypoint.sh"]
```

**Container Startup Process:**

The `docker-entrypoint.sh` script handles:

1. Decryption of environment variables if encrypted
2. Building the React application
3. Starting either the Node.js server or a static file server

**Environment Variables in Docker:**

Environment variables are passed to the container using:

```bash
# Create .env file for Docker
cp deploy/secrets/.env.example deploy/secrets/.env
# Edit the .env file with your credentials
nano deploy/secrets/.env
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

## Troubleshooting

### Development Issues

1. **API Connection Errors**

   If you encounter API connection issues during development:

   ```bash
   # Check if Netlify Functions are running
   curl http://localhost:8888/.netlify/functions/proxy
   
   # Check server logs
   npm run dev --debug
   ```

   Common solutions:
   - Verify environment variables are correctly set in `secrets/.env`
   - Ensure Shopify API credentials are valid
   - Check network connectivity to Shopify

2. **Port Conflicts**

   If you encounter port conflicts:

   ```bash
   # Find and kill processes using the ports
   ./cleanup-ports.sh
   ```

3. **Build Failures**

   For React build failures:

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules
   npm install
   
   # Clear cache
   npm cache clean --force
   ```

### Deployment Issues

1. **Docker Container Not Starting**

   Check container logs:

   ```bash
   docker logs asikhfarm
   ```

   Common solutions:
   - Verify environment variables in the container
   - Check for port conflicts on the host
   - Ensure the container has sufficient resources

2. **Nginx Configuration**

   Test Nginx configuration:

   ```bash
   sudo nginx -t
   ```

   Check Nginx logs:

   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **SSL Certificate Issues**

   Verify certificate status:

   ```bash
   sudo certbot certificates
   ```

   Force certificate renewal:

   ```bash
   sudo certbot renew --force-renewal
   ```

4. **WhatsApp Notification Failures**

   Check Twilio credentials and logs:

   ```bash
   # Verify Twilio credentials
   grep TWILIO secrets/.env
   
   # Check server logs for Twilio errors
   docker logs asikhfarm | grep Twilio
   ```

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
