// server.js - Express proxy to Shopify Storefront API (keeps access token secret)
const express = require('express');
// fetch removed; using axios for HTTP calls
const axios = require('axios');
require('dotenv').config();
const twilio = require('twilio'); // Add Twilio for WhatsApp notifications

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const shopifyStoreDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
// Debugging: ensure env vars loaded
console.log('Proxy DOMAIN:', DOMAIN);
console.log('Proxy Token loaded:', !!STOREFRONT_TOKEN);

// Use a non-conflicting port
const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Proxy is alive');
});

// GET /api/products
app.get('/api/products', async (req, res) => {
  console.log(' [GET] /api/products called');
  console.log('Using DOMAIN:', DOMAIN);
  console.log('Access token present:', !!STOREFRONT_TOKEN);

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
      { headers: { 'Content-Type':'application/json', 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN } }
    );
    console.log('Shopify response status:', shopifyResponse.status);
    const json = shopifyResponse.data;
    console.log('Shopify response JSON:', JSON.stringify(json, null, 2));
    const products = json.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      images: node.images.edges.map(e => ({ src: e.node.src })),
      variants: node.variants.edges.map(e => ({ id: e.node.id, title: e.node.title, priceV2: e.node.priceV2 }))
    }));
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/checkout
app.post('/api/checkout', async (req, res) => {
  console.log('[POST] /api/checkout called, body:', req.body);
  console.log('Checkout variables:', req.body);
  const { variantId, quantity } = req.body;
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
  const variables = { input: { lines: [{ merchandiseId: variantId, quantity }] } };
  try {
    // Debug: log the exact GraphQL mutation and variables being sent
    console.log('✅ GraphQL mutation:', mutation);
    console.log('✅ GraphQL variables:', variables);
    const shopifyResponse = await axios.post(
      `https://${DOMAIN}/api/2023-04/graphql.json`,
      { query: mutation, variables },
      { headers: { 'Content-Type':'application/json', 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN } }
    );
    console.log('Shopify checkout status:', shopifyResponse.status);
    const body = shopifyResponse.data;
    console.log('GraphQL response body:', JSON.stringify(body, null, 2));
    if (!body.data || !body.data.cartCreate) {
      console.error('GraphQL errors (no data):', body.errors || body);
      return res.status(502).json({ error: 'Shopify GraphQL error', details: body });
    }
    const { cartCreate } = body.data;
    if (cartCreate.userErrors && cartCreate.userErrors.length) {
      console.error('Cart creation errors:', cartCreate.userErrors);
      return res.status(400).json({ error: 'Checkout errors', details: cartCreate.userErrors });
    }
    return res.json({ webUrl: cartCreate.cart.checkoutUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

// Vendor PIN Verification
app.post('/api/vendor/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === process.env.VENDOR_PIN) {
    res.json({
      valid: true,
      vendor: process.env.VENDOR_NAME,
      contactName: process.env.VENDOR_CONTACT_NAME,
      email: process.env.VENDOR_EMAIL,
      phone: process.env.VENDOR_PHONE
    });
  } else {
    res.status(401).json({ error: "Invalid PIN" });
  }
});

// Create Shopify Order and Send Notification
app.post('/api/vendor/orders', async (req, res) => {
  try {
    const { variantId, quantity, deliveryDate, address, vendor, contactName } = req.body;

    if (!variantId || !quantity || !deliveryDate || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create draft order mutation
    const orderMutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Prepare variables for the mutation
    const variables = {
      input: {
        lineItems: [{
          variantId,
          quantity: parseInt(quantity)
        }],
        shippingAddress: {
          address1: address,
          city: 'Mumbai',
          province: 'Maharashtra',
          country: 'India'
        },
        customAttributes: [
          { key: 'Vendor', value: vendor },
          { key: 'Contact Name', value: contactName },
          { key: 'Delivery Date', value: deliveryDate }
        ]
      }
    };

    // Send mutation to Shopify
    const shopifyResponse = await axios.post(
      `https://${shopifyStoreDomain}/admin/api/2023-04/graphql.json`,
      {
        query: orderMutation,
        variables
      },
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    const { data } = shopifyResponse.data;
    
    if (data.draftOrderCreate.userErrors.length > 0) {
      throw new Error(data.draftOrderCreate.userErrors[0].message);
    }

    const orderName = data.draftOrderCreate.draftOrder.name;

    // Send WhatsApp notification
    const message = `New Bulk Order #${orderName}
Vendor: ${vendor}
Contact: ${contactName}
Quantity: ${quantity} boxes
Delivery Date: ${deliveryDate}
Address: ${address}`;

    const client = new twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${process.env.ADMIN_PHONE_NUMBER}`
    });

    res.json({ 
      success: true, 
      orderName,
      message: 'Order created successfully' 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create order' 
    });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
