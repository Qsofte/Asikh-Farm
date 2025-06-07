// functions/calculate-discount.js - Netlify Function to calculate discounted price from Shopify checkout
const axios = require('axios');
require('dotenv').config({ path: './secrets/.env' });

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  console.log('[POST] /api/calculate-discount called');

  // Get Shopify credentials from environment variables
  const DOMAIN = 
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
  const STOREFRONT_TOKEN =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!DOMAIN || !STOREFRONT_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Shopify credentials' })
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const { variantId, quantity = 1, discountCode } = requestBody;

    if (!variantId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameter: variantId' })
      };
    }

    // Create a checkout to get the discounted price
    const checkoutMutation = `
      mutation {
        checkoutCreate(input: {
          lineItems: [{ variantId: "${variantId}", quantity: ${quantity} }]
          ${discountCode ? `discountCodes: ["${discountCode}"]` : ''}
        }) {
          checkout {
            id
            lineItems(first: 1) {
              edges {
                node {
                  id
                  title
                  variant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                  discountAllocations {
                    allocatedAmount {
                      amount
                      currencyCode
                    }
                    discountApplication {
                      ... on AutomaticDiscountApplication {
                        title
                      }
                      ... on DiscountCodeApplication {
                        code
                        title
                      }
                      ... on ManualDiscountApplication {
                        title
                      }
                      ... on ScriptDiscountApplication {
                        title
                      }
                    }
                  }
                }
              }
            }
            subtotalPriceV2 {
              amount
              currencyCode
            }
            totalPriceV2 {
              amount
              currencyCode
            }
            discountApplications(first: 10) {
              edges {
                node {
                  ... on AutomaticDiscountApplication {
                    title
                  }
                  ... on DiscountCodeApplication {
                    code
                    title
                  }
                  ... on ManualDiscountApplication {
                    title
                  }
                  ... on ScriptDiscountApplication {
                    title
                  }
                }
              }
            }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const shopifyResponse = await axios.post(
      `https://${DOMAIN}/api/2023-04/graphql.json`,
      { query: checkoutMutation },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        },
      }
    );

    const { data } = shopifyResponse.data;
    
    if (data.checkoutCreate.checkoutUserErrors && data.checkoutCreate.checkoutUserErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Checkout creation failed', 
          details: data.checkoutCreate.checkoutUserErrors 
        })
      };
    }

    const checkout = data.checkoutCreate.checkout;
    if (!checkout || !checkout.lineItems.edges.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No items in checkout' })
      };
    }

    const lineItem = checkout.lineItems.edges[0].node;
    const variant = lineItem.variant;
    const originalPrice = parseFloat(variant.priceV2.amount) * quantity;
    
    // Calculate total discount amount from all discount allocations
    let discountAmount = 0;
    let discountTitle = '';
    
    if (lineItem.discountAllocations && lineItem.discountAllocations.length > 0) {
      lineItem.discountAllocations.forEach(allocation => {
        discountAmount += parseFloat(allocation.allocatedAmount.amount);
        if (!discountTitle && allocation.discountApplication) {
          if (allocation.discountApplication.title) {
            discountTitle = allocation.discountApplication.title;
          } else if (allocation.discountApplication.code) {
            discountTitle = allocation.discountApplication.code;
          }
        }
      });
    }

    // Calculate final price after discounts
    const finalPrice = originalPrice - discountAmount;
    const discountPercent = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        discountInfo: {
          originalPrice: originalPrice.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          finalPrice: finalPrice.toFixed(2),
          discountPercent,
          discountTitle,
          currencyCode: variant.priceV2.currencyCode
        }
      })
    };
  } catch (error) {
    console.error('Error calculating discount:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error calculating discount', 
        message: error.message 
      })
    };
  }
};
