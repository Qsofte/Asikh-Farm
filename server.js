// server.js - Express proxy to Shopify Storefront API (keeps access token secret)
const express = require('express');
// fetch removed; using axios for HTTP calls
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
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
  const { variantId, quantity } = req.body;
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout { webUrl }
        userErrors { field message }
      }
    }
  `;
  const variables = { input: { lineItems: [{ variantId, quantity }] } };
  try {
    const shopifyResponse = await axios.post(
      `https://${DOMAIN}/api/2023-04/graphql.json`,
      { query: mutation, variables },
      { headers: { 'Content-Type':'application/json', 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN } }
    );
    const graphqlData = shopifyResponse.data.data;
    res.json({ webUrl: graphqlData.checkoutCreate.checkout.webUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
