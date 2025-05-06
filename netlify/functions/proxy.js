const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Incoming request:', {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers
  });

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
    // Try REST API first to verify connectivity
    const restUrl = `https://${shopifyDomain}/api/2023-10/products.json`;
    console.log('Making Shopify REST request to:', restUrl);
    
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyToken
      }
    });

    console.log('Shopify response status:', response.status);
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      
      // Transform the REST API response to match the GraphQL structure
      const transformedData = {
        data: {
          products: {
            edges: data.products.map(product => ({
              node: {
                id: product.id,
                title: product.title,
                description: product.body_html,
                images: {
                  edges: product.images.map(image => ({
                    node: {
                      src: image.src
                    }
                  }))
                },
                variants: {
                  edges: product.variants.map(variant => ({
                    node: {
                      id: variant.id,
                      title: variant.title,
                      priceV2: {
                        amount: variant.price,
                        currencyCode: 'INR'
                      }
                    }
                  }))
                }
              }
            }))
          }
        }
      };

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify(transformedData)
      };
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Invalid JSON response from Shopify');
    }
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
