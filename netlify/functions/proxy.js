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

  try {
    // Just return a simple test response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Test response from proxy function',
        timestamp: new Date().toISOString(),
        event: {
          path: event.path,
          httpMethod: event.httpMethod,
          headers: event.headers
        },
        env: {
          hasDomain: !!process.env.SHOPIFY_STORE_DOMAIN,
          hasToken: !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          domain: process.env.SHOPIFY_STORE_DOMAIN
        }
      })
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
