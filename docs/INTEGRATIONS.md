# Third-Party Integrations Guide

## Social Media Integrations

### Instagram
```javascript
// Configuration
const instagramConfig = {
  clientId: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  redirectUri: `${process.env.APP_URL}/auth/instagram/callback`,
  scope: ['user_profile', 'user_media']
};

// Authentication Flow
async function instagramAuth() {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  // Redirect user to authUrl
}

// Media Fetch
async function getInstagramMedia(userId, accessToken) {
  const response = await fetch(`https://graph.instagram.com/v12.0/${userId}/media?access_token=${accessToken}`);
  return response.json();
}
```

### TikTok
```javascript
// Configuration
const tiktokConfig = {
  clientKey: process.env.TIKTOK_CLIENT_KEY,
  clientSecret: process.env.TIKTOK_CLIENT_SECRET,
  scope: ['user.info.basic', 'video.list']
};

// Authentication
async function tiktokAuth() {
  const authUrl = `https://open-api.tiktok.com/platform/oauth/connect?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}`;
  // Redirect user to authUrl
}

// Video Fetch
async function getTikTokVideos(accessToken) {
  const response = await fetch('https://open-api.tiktok.com/video/list/', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.json();
}
```

## Payment Integrations

### Stripe
```javascript
// Configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Payment Intent
async function createPayment(amount, currency = 'usd') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  });
  return paymentIntent;
}

// Subscription
async function createSubscription(customerId, priceId) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  });
  return subscription;
}
```

### PayPal
```javascript
// Configuration
const paypal = require('@paypal/checkout-server-sdk');
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Create Order
async function createOrder(amount) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount
      }
    }]
  });
  const order = await client.execute(request);
  return order;
}
```

## Shipping Integrations

### ShipStation
```javascript
// Configuration
const shipstation = require('shipstation')(apiKey, apiSecret);

// Create Label
async function createShippingLabel(orderDetails) {
  const label = await shipstation.orders.createLabel({
    orderId: orderDetails.id,
    carrierCode: orderDetails.carrier,
    serviceCode: orderDetails.service,
    packageCode: orderDetails.package,
    confirmation: orderDetails.confirmation,
    shipDate: new Date().toISOString()
  });
  return label;
}
```

## Analytics Integrations

### Google Analytics 4
```javascript
// Configuration
const measurementId = 'G-XXXXXXXXXX';

// Event Tracking
function trackEvent(eventName, params = {}) {
  gtag('event', eventName, {
    ...params,
    timestamp: new Date().toISOString()
  });
}

// E-commerce Tracking
function trackPurchase(transaction) {
  gtag('event', 'purchase', {
    transaction_id: transaction.id,
    value: transaction.total,
    currency: 'USD',
    items: transaction.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
}
```

### Mixpanel
```javascript
// Configuration
const mixpanel = require('mixpanel').init(process.env.MIXPANEL_TOKEN);

// Event Tracking
function trackUserAction(userId, event, properties = {}) {
  mixpanel.track(event, {
    distinct_id: userId,
    ...properties,
    timestamp: new Date().getTime()
  });
}

// User Profile
function updateUserProfile(userId, properties) {
  mixpanel.people.set(userId, {
    ...properties,
    $last_seen: new Date().toISOString()
  });
}
```

## CRM Integrations

### HubSpot
```javascript
// Configuration
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_TOKEN });

// Contact Creation
async function createContact(userData) {
  const contact = await hubspotClient.crm.contacts.basicApi.create({
    properties: {
      email: userData.email,
      firstname: userData.firstName,
      lastname: userData.lastName,
      phone: userData.phone
    }
  });
  return contact;
}

// Deal Creation
async function createDeal(dealData) {
  const deal = await hubspotClient.crm.deals.basicApi.create({
    properties: {
      dealname: dealData.name,
      amount: dealData.amount,
      dealstage: dealData.stage,
      pipeline: dealData.pipeline
    }
  });
  return deal;
}
```

## Email Marketing Integrations

### Mailchimp
```javascript
// Configuration
const mailchimp = require('@mailchimp/mailchimp_marketing');
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

// Subscribe User
async function subscribeToNewsletter(email, tags = []) {
  const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
    email_address: email,
    status: 'subscribed',
    tags
  });
  return response;
}

// Send Campaign
async function sendCampaign(campaignData) {
  const campaign = await mailchimp.campaigns.create({
    type: 'regular',
    recipients: { list_id: process.env.MAILCHIMP_LIST_ID },
    settings: {
      subject_line: campaignData.subject,
      from_name: campaignData.fromName,
      reply_to: campaignData.replyTo
    }
  });
  return campaign;
}
```

## File Storage Integrations

### AWS S3
```javascript
// Configuration
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Upload File
async function uploadFile(file, path) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: path,
    Body: file.buffer,
    ContentType: file.mimetype
  };
  const upload = await s3.upload(params).promise();
  return upload;
}

// Generate Signed URL
function getSignedUrl(key, expirationTime = 3600) {
  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: expirationTime
  });
  return url;
}
```

## Search Integrations

### Elasticsearch
```javascript
// Configuration
const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY
  }
});

// Index Document
async function indexDocument(index, document) {
  const response = await client.index({
    index,
    body: document
  });
  return response;
}

// Search
async function search(index, query) {
  const response = await client.search({
    index,
    body: {
      query: {
        multi_match: {
          query,
          fields: ['title', 'description', 'tags']
        }
      }
    }
  });
  return response.hits.hits;
}
```

## Integration Best Practices

### Security
1. Never expose API keys in client-side code
2. Use environment variables for sensitive data
3. Implement rate limiting
4. Use webhook signatures when available
5. Regular security audits

### Performance
1. Implement caching strategies
2. Use batch operations when possible
3. Handle API rate limits
4. Implement retry mechanisms
5. Monitor API response times

### Error Handling
1. Implement proper error logging
2. Use try-catch blocks
3. Handle API-specific errors
4. Implement fallback mechanisms
5. Monitor integration health

### Testing
1. Unit tests for integration code
2. Integration tests with API mocks
3. End-to-end tests
4. Performance testing
5. Security testing
