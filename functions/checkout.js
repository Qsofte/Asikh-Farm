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
      
      // Extract specific error message if available
      let errorMessage = 'Unable to add product to cart';
      if (body.errors && body.errors.length > 0) {
        // Check for specific error types
        const firstError = body.errors[0];
        if (firstError.message) {
          if (firstError.message.includes('not found')) {
            errorMessage = 'This product is no longer available in our inventory.';
          } else if (firstError.message.includes('stock')) {
            errorMessage = 'This product is currently out of stock.';
          } else {
            // Use the actual error message but make it user-friendly
            errorMessage = firstError.message
              .replace(/\[.*?\]/g, '') // Remove any code references
              .replace(/GraphQL error/i, 'Product error')
              .trim();
          }
        }
      }
      
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }

    const { cartCreate } = body.data;
    if (cartCreate.userErrors && cartCreate.userErrors.length) {
      console.error('Cart creation errors:', JSON.stringify(cartCreate.userErrors, null, 2));
      
      // Get the first error (most relevant)
      const userError = cartCreate.userErrors[0];
      let errorMessage = 'Unable to add product to cart';
      
      if (userError.message) {
        // Extract product name from error message if it's a sold-out error
        const soldOutMatch = userError.message.match(/The product ['"](.*?)['"] is already sold out\./);
        
        if (soldOutMatch && soldOutMatch[1]) {
          // Use the exact product name from the error message
          const productName = soldOutMatch[1];
          errorMessage = `${productName} is sold out.`;
        } 
        // Handle other common error types
        else if (userError.message.includes('not available')) {
          errorMessage = 'This product is currently not available for purchase.';
        } else if (userError.message.includes('sold out') || userError.message.includes('out of stock')) {
          errorMessage = 'This product is sold out. Please check back later.';
        } else if (userError.message.includes('quantity')) {
          errorMessage = 'The requested quantity is not available. Please try a smaller quantity.';
        } else if (userError.message.includes('invalid')) {
          errorMessage = 'This product option is no longer available.';
        } else {
          // Use the actual error but make it user-friendly
          errorMessage = userError.message
            .replace(/line item/i, 'product')
            .replace(/merchandise/i, 'product variant')
            .replace(/cart/i, 'shopping cart');
        }
      }
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: errorMessage,
          details: cartCreate.userErrors
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ webUrl: cartCreate.cart.checkoutUrl })
    };
  } catch (err) {
    console.error('Error creating checkout:', err);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Unable to process your order at this time.';
    let statusCode = 500;
    
    if (err.response) {
      // The request was made and the server responded with an error status
      statusCode = err.response.status;
      
      if (err.response.status === 404) {
        errorMessage = 'This product could not be found in our catalog.';
      } else if (err.response.status === 422) {
        errorMessage = 'This product is no longer available in the requested configuration.';
      } else if (err.response.data && err.response.data.errors) {
        // Try to extract meaningful error from the response
        errorMessage = 'Product unavailable: ' + err.response.data.errors[0];
      }
    } else if (err.request) {
      // The request was made but no response was received
      errorMessage = 'Unable to connect to our product service. Please check your internet connection.';
      statusCode = 503;
    } else if (err.message && err.message.includes('variant')) {
      // Something happened in setting up the request that triggered an Error
      errorMessage = 'The selected product variant is not available.';
      statusCode = 400;
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};
