const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Log the incoming request
  console.log('Incoming request:', {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers
  });

  if (event.body) {
    try {
      const parsedBody = JSON.parse(event.body);
      console.log('Request body:', parsedBody);
    } catch (e) {
      console.log('Raw request body:', event.body);
    }
  }

  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const shopifyToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  // Log environment variables (without sensitive data)
  console.log('Environment check:', {
    hasDomain: !!shopifyDomain,
    hasToken: !!shopifyToken,
    domain: shopifyDomain // Adding this for debugging
  });

  if (!shopifyDomain || !shopifyToken) {
    console.error('Missing Shopify configuration');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Missing Shopify configuration' })
    };
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Construct GraphQL query for products
    const query = `
      query {
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const shopifyUrl = `https://${shopifyDomain}/api/2023-10/graphql.json`;
    console.log('Making Shopify request to:', shopifyUrl);
    
    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyToken,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    console.log('Shopify response status:', response.status);
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Invalid JSON response from Shopify');
    }

    console.log('Shopify response data:', JSON.stringify(data).substring(0, 200) + '...');

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify({ errors: data.errors })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
