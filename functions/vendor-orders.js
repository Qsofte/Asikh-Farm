// functions/vendor-orders.js - Netlify Function to create Shopify orders for vendors
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
    console.log('Twilio client initialized successfully');
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

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const {
      variantId,
      quantity,
      deliveryDate,
      address,
      vendor,
      contactName,
      email,
    } = requestBody;

    // Get Shopify store domain from environment variables
    const shopifyStoreDomain =
      process.env.SHOPIFY_STORE_DOMAIN ||
      process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;

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

    // Create order via REST Admin API
    const shopifyOrderResponse = await axios.post(
      `https://${shopifyStoreDomain}/admin/api/2023-04/orders.json`,
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
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
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
        const vendorPhone = process.env.VENDOR_PHONE || '+64223121780'; // Use default if not set
        const formattedPhone = vendorPhone.startsWith('+') ? vendorPhone : `+${vendorPhone}`;
        
        console.log(`Sending WhatsApp to: ${formattedPhone}`);
        
        // Use WhatsApp with a valid template format
        const twilioMessage = await twilioClient.messages.create({
          body: `Your Asikh Farm order was received! New Bulk Order #${orderName} from ${vendor} for ${quantity} boxes. Delivery on ${deliveryDate}. Contact: ${contactName}, ${email}`,
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
};
