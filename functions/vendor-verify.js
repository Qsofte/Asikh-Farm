// functions/vendor-verify.js - Netlify Function to verify vendor PIN
require('dotenv').config({ path: './secrets/.env' });

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { pin } = requestBody;

    if (pin === process.env.VENDOR_PIN) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: true,
          vendor: process.env.VENDOR_NAME,
          contactName: process.env.VENDOR_CONTACT_NAME,
          email: process.env.VENDOR_EMAIL,
          phone: process.env.VENDOR_PHONE,
        })
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid PIN' })
      };
    }
  } catch (err) {
    console.error('Error verifying PIN:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error verifying PIN' })
    };
  }
};
