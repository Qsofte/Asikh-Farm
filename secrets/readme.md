# Secrets Management

This directory contains sensitive environment variables and credentials for the Asikh Farm application.

## Files

- `.env` - Contains all environment variables for development and production
- `.env.encrypted` - Encrypted version of the .env file for secure storage

## Environment Variables

The following environment variables are required:

### Shopify API
- `SHOPIFY_STORE_DOMAIN` - Shopify store domain
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Access token for Shopify Storefront API
- `SHOPIFY_ADMIN_ACCESS_TOKEN` - Access token for Shopify Admin API

### Vendor Information
- `VENDOR_PIN` - PIN for vendor authentication
- `VENDOR_NAME` - Name of the vendor
- `VENDOR_CONTACT_NAME` - Contact name for the vendor
- `VENDOR_EMAIL` - Email address for the vendor
- `VENDOR_PHONE` - Phone number for the vendor

### Twilio (for WhatsApp notifications)
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_PHONE_NUMBER` - Twilio phone number for sending messages

### Server Configuration
- `PORT` - Port for the Node.js server
- `PROXY_PORT` - Port for the proxy server

## Encryption/Decryption

To encrypt the `.env` file:

```bash
node encrypt-env.js [password]
```

To decrypt the `.env.encrypted` file:

```bash
node decrypt-env.js
```

**Note:** These files should never be committed to version control. The `.gitignore` file is configured to exclude them.
