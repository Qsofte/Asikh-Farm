// functions/products.js - Netlify Function to fetch products from Shopify
const axios = require('axios');
require('dotenv').config({ path: './secrets/.env' });

// Handler for the Netlify Function
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  console.log('[GET] /api/products called');

  // Get Shopify credentials from environment variables
  const DOMAIN = 
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
  const STOREFRONT_TOKEN =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  console.log('Using DOMAIN:', DOMAIN);
  console.log('Access token present:', !!STOREFRONT_TOKEN);

  if (!DOMAIN || !STOREFRONT_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Shopify credentials' })
    };
  }

  const query = `
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
  `;

  try {
    console.log('Shopify request query:', query);
    const shopifyResponse = await axios.post(
      `https://${DOMAIN}/api/2023-04/graphql.json`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        },
      }
    );

    console.log('Shopify response status:', shopifyResponse.status);
    const json = shopifyResponse.data;
    console.log('Shopify response JSON:', JSON.stringify(json, null, 2));

    const products = json.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      images: node.images.edges.map((e) => ({ src: e.node.src })),
      variants: node.variants.edges.map((e) => ({
        id: e.node.id,
        title: e.node.title,
        priceV2: e.node.priceV2,
      })),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products)
    };
  } catch (err) {
    console.error('Error fetching products:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch products' })
    };
  }
};
