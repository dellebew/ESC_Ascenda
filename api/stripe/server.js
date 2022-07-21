require("dotenv").config()
const express = require('express');
const app = express();
var router = express.Router();
const { resolve } = require('path');
var setSuccessfulPayments = require("../controllers/successfulPaymentController");
var setIncompletePayments = require("../controllers/incompletePaymentController");

// Copy the .env.example in the root into a .env file in this folder

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
// const stripe = require('stripe')("sk_test_51L8fUrGixach2Gt0nSb6scQ4G0WmYn65wkKwgErUmTO6jmg4vOshQI5PjbCnjIeZoVcUq9cgeVZU8HDv4u00ryId00mEgUt1Oa");

router.get('/config', async (req, res) => {
    // const price = await stripe.prices.retrieve(process.env.PRICE);
    res.send({
      publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      // unitAmount: price.unit_amount,
      // currency: price.currency,
      unitAmount: 200*100,
      currency: "SGD",
    });
});
  
  // Fetch the Checkout Session to display the JSON result on the success page
router.get('/checkout-session', async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
  
    // retrieve payment id, product id for product name
    paymentRetrieve = stripe.prices.retrieve(session.paymentid);
    productRetrieve = stripe.products.retrieve(paymentRetrieve.product);
    
    // retrieve pre-saved data using sessionid
    const billingInfo = {
      id: session.id,
      name: session.name,
      email: session.email,
      address: session.address,
      paymentid: session.paymentid,
      hotelName: productRetrieve.name,
    }

    const inputData = setSuccessfulPayments(billingInfo);
    inputData;

    res.send(session);
});


router.post('/create-checkout-session', async (req, res) => {
  
  // WIP for data to be added to database.
  // const { quantity } = req.body;
  console.log("here");
  //console.log(req.body);

  // const state = JSON.stringify(req.body);
  const state = (req.body);

  console.log(JSON.stringify(state));
  // const { date, message, roomType, options } = req.body;
  console.log("here");

  //state looks like this: 
  // const state = {
  //   start: date.startDate, 
  //   end: date.endDate,
  //   message: message,
  //   roomType: roomType,
  //   adultQuantity: options.adult, 
  //   childrenQuality: options.children,
  // }

  // calculations for Number of Nights:
  const diffInMs = Math.abs(state.end - state.start);
  const numOfNights = diffInMs / (1000 * 60 * 60 * 24);

  const description = "Number of Nights: " + 
  numOfNights + "\nStart Date: " + state.start
  + "\nEnd Date: " + state.end + "\nNumber of Adults: "
  + state.adultQuantity + "\nNumber of Children: "
  + state.childrenQuantity + "\nRoom Type: " + state.roomType
  + "\nComments for hotel: " + state.message

  const product = await stripe.products.create({
    name: 'Hotel Name',
    // description: "Contains: Number of nights, start date, end date, adults, children, message to hotel, room types",
    description: description
  });

  console.log(product.id);

  const price = await stripe.prices.create({
      unit_amount: 20*100,
      currency: 'sgd',
      // product: 'prod_M0kZOf836DEs60',
      product: product.id,
  });

  console.log(price.id);

  const session = await stripe.checkout.sessions.create({
    
      line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price: 'price_1LIj48Gixach2Gt0JfKGc1wS',
        price: price.id,
        quantity: 2,
        // quantity: quantity
      },
    ],
    mode: 'payment',
    customer_creation: "always",
    success_url: `${process.env.CLIENT_URL}/checkout/success`,
    cancel_url: `${process.env.CLIENT_URL}/checkout/canceled`,
    billing_address_collection: 'required',
    phone_number_collection: {"enabled": true},
  });

  // add the state info to database with the session id as key first
  // const pre_payment_inp = {
  //   id: session.id,
  //   state: state,
  // }
  // const store = setIncompletePayments(pre_payment_inp);
  // store()

  console.log("Redirecting to 303")
  res.redirect(303, session.url);  

});

router.post('/webhook', async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers['stripe-signature'];
  
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }
  
    if (eventType === 'checkout.session.completed') {
      console.log(`🔔  Payment received!`);
    }
  
    res.sendStatus(200);
  });
  
  // app.listen(8080, () => console.log(`Node server listening on port ${4242}!`));

  module.exports = router;