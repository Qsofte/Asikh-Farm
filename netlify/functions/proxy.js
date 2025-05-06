const Client = require('shopify-buy');

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
    // Initialize Shopify client
    const client = Client.buildClient({
      domain: shopifyDomain,
      storefrontAccessToken: shopifyToken
    });

    console.log('Fetching products from Shopify...');
    const products = await client.product.fetchAll();
    console.log('Fetched products count:', products.length);

    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => {
      // Extract the raw product data
      const rawProduct = product;
      
      return {
        id: rawProduct.id,
        title: rawProduct.title,
        description: rawProduct.description,
        images: rawProduct.images.map(image => ({
          src: image.src
        })),
        variants: rawProduct.variants.map(variant => {
          // Handle different price formats
          let price;
          let currencyCode = 'INR';
          
          // Check if price is already a string
          if (typeof variant.price === 'string') {
            price = variant.price;
          } 
          // Handle object with amount property (like in the test output)
          else if (variant.price && variant.price.amount && typeof variant.price.amount === 'object') {
            price = variant.price.amount.amount;
            currencyCode = variant.price.amount.currencyCode || 'INR';
          }
          // Handle price object directly
          else if (variant.price && variant.price.amount) {
            price = variant.price.amount;
            currencyCode = variant.price.currencyCode || 'INR';
          } else {
            price = '0.00';
          }
          
          return {
            id: variant.id,
            title: variant.title,
            priceV2: {
              amount: price,
              currencyCode: currencyCode
            }
          };
        })
      };
    });

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
