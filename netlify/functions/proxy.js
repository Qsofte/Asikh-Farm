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
  const shopifyToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

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
    // Use Admin API to get products
    const shopifyUrl = `https://${shopifyDomain}/admin/api/2023-10/products.json`;
    console.log('Making Shopify request to:', shopifyUrl);
    
    const response = await fetch(shopifyUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': shopifyToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('Shopify response status:', response.status);
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    // Transform Admin API response to match frontend expectations
    const transformedProducts = data.products.map(product => ({
      id: product.id.toString(),
      title: product.title,
      description: product.body_html,
      images: product.images.map(image => ({
        src: image.src
      })),
      variants: product.variants.map(variant => ({
        id: variant.id.toString(),
        title: variant.title,
        priceV2: {
          amount: variant.price,
          currencyCode: 'INR'
        }
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
