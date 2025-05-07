// functions/checkout.js - Netlify Function to create a checkout/cart in Shopify
const axios = require('axios');
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

  console.log('[POST] /api/checkout called');

  // Get Shopify credentials from environment variables
  const DOMAIN = 
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
  const STOREFRONT_TOKEN =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!DOMAIN || !STOREFRONT_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Shopify credentials' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { variantId, quantity } = requestBody;
    
    console.log('Checkout variables:', requestBody);
    console.log('Mutation payload:', { variantId, quantity });

    // Use Cart API instead of deprecated checkoutCreate
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { checkoutUrl }
          userErrors { field message }
        }
      }
    `;
    
    const variables = {
      input: { lines: [{ merchandiseId: variantId, quantity: parseInt(quantity) || 1 }] },
    };

    // Debug: log the exact GraphQL mutation and variables being sent
    console.log('✅ GraphQL mutation:', mutation);
    console.log('✅ GraphQL variables:', variables);

    const shopifyResponse = await axios.post(
      `https://${DOMAIN}/api/2023-04/graphql.json`,
      { query: mutation, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        },
      }
    );

    console.log('Shopify checkout status:', shopifyResponse.status);
    const body = shopifyResponse.data;
    console.log('GraphQL response body:', JSON.stringify(body, null, 2));

    if (!body.data || !body.data.cartCreate) {
      console.error('GraphQL errors (no data):', body.errors || body);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'Shopify GraphQL error', details: body })
      };
    }

    const { cartCreate } = body.data;
    if (cartCreate.userErrors && cartCreate.userErrors.length) {
      console.error('Cart creation errors:', cartCreate.userErrors);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Checkout errors', details: cartCreate.userErrors })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ webUrl: cartCreate.cart.checkoutUrl })
    };
  } catch (err) {
    console.error('Error creating checkout:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create checkout' })
    };
  }
};
