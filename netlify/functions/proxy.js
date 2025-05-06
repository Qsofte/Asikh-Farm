const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Starting proxy function...');

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const shopifyToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  console.log('Environment check:', {
    hasDomain: !!shopifyDomain,
    hasToken: !!shopifyToken,
    domain: shopifyDomain
  });

  if (!shopifyDomain || !shopifyToken) {
    console.error('Missing Shopify configuration');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Shopify configuration' })
    };
  }

  try {
    // Use Storefront API to get products
    const shopifyUrl = `https://${shopifyDomain}/api/2024-01/graphql.json`;
    console.log('Making Shopify request to:', shopifyUrl);
    
    const query = `{
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            images(first: 1) {
              edges {
                node {
                  transformedSrc
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
    }`;

    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': shopifyToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    console.log('Shopify response status:', response.status);
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    // Transform GraphQL response to match frontend expectations
    const transformedProducts = data.data.products.edges.map(({ node: product }) => ({
      id: product.id.split('/').pop(),
      title: product.title,
      description: product.description,
      images: product.images.edges.map(({ node: image }) => ({
        src: image.transformedSrc
      })),
      variants: product.variants.edges.map(({ node: variant }) => ({
        id: variant.id.split('/').pop(),
        title: variant.title,
        priceV2: variant.priceV2
      }))
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transformedProducts)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      })
    };
  }
};
