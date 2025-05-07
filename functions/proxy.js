// functions/proxy.js - Netlify Function to proxy requests to Shopify API
const axios = require('axios');
require('dotenv').config({ path: './secrets/.env' });

// Import Twilio with explicit require
let twilioClient;
try {
  const twilioModule = require('twilio');
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilioModule(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('Twilio client initialized successfully in proxy.js');
  } else {
    console.warn('Twilio credentials missing, WhatsApp notifications will be disabled');
  }
} catch (err) {
  console.error('Failed to initialize Twilio client:', err.message);
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Get Shopify credentials from environment variables
  const DOMAIN = 
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
  const STOREFRONT_TOKEN =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!DOMAIN || !STOREFRONT_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Shopify credentials' })
    };
  }

  console.log(`Proxy request: ${event.httpMethod} ${event.path}`);
  
  try {
    // Parse the path to determine the action
    const path = event.path.replace('/.netlify/functions/proxy', '');
    console.log(`Parsed path: ${path}`);
    
    // Parse the request body for POST requests
    let requestBody = {};
    if (event.body) {
      try {
        requestBody = JSON.parse(event.body);
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }
    
    // Handle paths that include /api/ prefix (from redirects)
    if (path.startsWith('/api/')) {
      const action = path.split('/')[2]; // e.g., /api/products -> products
      console.log(`API action: ${action}`);
      
      if (action === 'products' || !action) {
        return await handleProducts(DOMAIN, STOREFRONT_TOKEN, headers);
      } else if (action === 'checkout') {
        return await handleCheckout(DOMAIN, STOREFRONT_TOKEN, headers, requestBody);
      } else if (action === 'vendor') {
        const vendorAction = path.split('/')[3]; // e.g., /api/vendor/verify -> verify
        if (vendorAction === 'verify') {
          return await handleVendorVerify(headers, requestBody);
        } else if (vendorAction === 'orders') {
          return await handleVendorOrders(DOMAIN, ADMIN_TOKEN, headers, requestBody);
        }
      }
    }
    
    // Handle direct requests like /products, /checkout (fallback)
    if (path === '/products' || path === '') {
      return await handleProducts(DOMAIN, STOREFRONT_TOKEN, headers);
    } else if (path === '/checkout') {
      return await handleCheckout(DOMAIN, STOREFRONT_TOKEN, headers, requestBody);
    } else if (path.startsWith('/vendor')) {
      const vendorAction = path.split('/')[2]; // e.g., /vendor/verify, /vendor/orders
      if (vendorAction === 'verify') {
        return await handleVendorVerify(headers, requestBody);
      } else if (vendorAction === 'orders') {
        return await handleVendorOrders(DOMAIN, ADMIN_TOKEN, headers, requestBody);
      }
    }
    
    // If we get here, no matching action was found
    console.log(`No handler found for path: ${path}`);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Unknown action', path: path })
    };
  
  } catch (err) {
    console.error('Proxy error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Proxy error', details: err.message })
    };
  }
};

// Handle /api/products
async function handleProducts(DOMAIN, STOREFRONT_TOKEN, headers) {
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
    
    const json = shopifyResponse.data;
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
}

// Handle /api/checkout
async function handleCheckout(DOMAIN, STOREFRONT_TOKEN, headers, requestBody) {
  const { variantId, quantity } = requestBody;
  
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
  
  try {
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
    
    const body = shopifyResponse.data;
    
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
}

// Handle /api/vendor/verify
async function handleVendorVerify(headers, requestBody) {
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
}

// Handle /api/vendor/orders
async function handleVendorOrders(DOMAIN, ADMIN_TOKEN, headers, requestBody) {
  const {
    variantId,
    quantity,
    deliveryDate,
    address,
    vendor,
    contactName,
    email,
    phone,
  } = requestBody;
  
  // Extract numeric variant ID from GraphQL global ID
  const variantParts = variantId.toString().split('/');
  const variantIdNumeric = parseInt(
    variantParts[variantParts.length - 1],
    10
  );
  
  if (isNaN(variantIdNumeric)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid variant ID' })
    };
  }
  
  if (!variantId || !quantity || !deliveryDate || !address || !email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }
  
  try {
    // Create order via REST Admin API
    const shopifyOrderResponse = await axios.post(
      `https://${DOMAIN}/admin/api/2023-04/orders.json`,
      {
        order: {
          email,
          line_items: [
            { variant_id: variantIdNumeric, quantity: parseInt(quantity) },
          ],
          shipping_address: {
            address1: address,
            city: 'Mumbai',
            province: 'Maharashtra',
            country: 'India',
          },
          note: `Vendor: ${vendor}, Contact: ${contactName}, Delivery Date: ${deliveryDate}`,
          financial_status: 'pending',
        },
      },
      {
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const orderData = shopifyOrderResponse.data.order;
    const shopifyOrderId = orderData.id;
    const orderNumber = orderData.order_number.toString();
    const orderName = orderNumber;
    
    // Send WhatsApp notification if Twilio is configured
    let notificationSent = false;
    let notificationError = null;
    
    if (twilioClient) {
      try {
        console.log('Attempting to send WhatsApp notification via Twilio...');
        
        // Format phone number to ensure it has the correct format for Twilio
        let formattedPhone = phone;
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = `+${formattedPhone}`;
        }
        
        // Send WhatsApp message
        const message = `Hello ${vendor}, your order #${orderNumber} has been received. We will deliver on ${deliveryDate}. Thank you for your business!`;
        
        const twilioMessage = await twilioClient.messages.create({
          body: message,
          from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
          to: `whatsapp:${formattedPhone}`
        });
        
        console.log('Twilio WhatsApp message sent successfully:', twilioMessage.sid);
        notificationSent = true;
      } catch (twilioError) {
        console.error('Twilio notification error:', twilioError.message);
        if (twilioError.code) {
          console.error('Twilio error code:', twilioError.code);
        }
        notificationError = twilioError.message;
      }
    } else {
      console.warn('Twilio client not initialized, skipping WhatsApp notification');
      notificationError = 'Twilio client not initialized';
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: shopifyOrderId,
        orderName,
        orderNumber,
        notification: {
          sent: notificationSent,
          error: notificationError
        }
      })
    };
  } catch (error) {
    console.error('Order creation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Failed to create order',
      })
    };
  }
}
