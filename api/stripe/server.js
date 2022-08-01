require("dotenv").config();
const express = require('express');
const app = express();
var router = express.Router();
const { resolve } = require('path');
var successController = require("../controllers/successfulPaymentController.js");
// import {default as setSuccessfulPayments, queryData} from "../controllers/successfulPaymentController.js"
var incompleteController = require("../controllers/incompletePaymentController.js");
var stripe_testing = require("./server_catches.js");

// Copy the .env.example in the root into a .env file in this folder

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
router.get('/failed-checkout-session/:curTime', async (req, res) => {
  
  console.log("in failed server side checkout-session");
  console.log(JSON.stringify(req.params));
  let link = {link: "/"};
  try{
    const curTime = req.params.curTime;
    // const sessionId = useLocation();
    // retrieve from intermediatePayment
    const queryDataRaw = await incompleteController.setIncompletePayments(curTime, false);
    // if (!stripe_testing.checkInputData(JSON.parse(queryDataRaw))){throw new Error('no link created')}
    
    link = JSON.parse(queryDataRaw);
    
    console.log(link.link); 
    res.send(JSON.stringify(link));

  } catch {
    console.log("error");
    // res.sendStatus(404);
    res.send({link: "/"})
    res.end();
  }


});
  // Fetch the Checkout Session to display the JSON result on the success page
router.get('/checkout-session/:id', async (req, res) => {
  
  try{
    console.log("in server side checkout-session");
    // const sessionId = location.search.replace('?session_id=', '');
    const sessionId = req.params.id;
    //const sessionId = req.query.sessionId;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // console.log(sessionId);
    // console.log(session);

    // retrieve payment id, product id for product name
    const paymentRetrieve = stripe.paymentIntents.retrieve(session.payment_intent);
    const price = paymentRetrieve.amount/100;
    //productRetrieve = stripe.products.retrieve(paymentRetrieve.product);
    
    // retrieve pre-saved data using sessionid
    const billingInfo = {
      sessionId: session.id,
      name: session.customer_details.name,
      email: session.customer_details.email,
      // address: session.customer_details.address,
      paymentid: session.payment_intent,
    }
    
    console.log(billingInfo);
    // const loading = true;
    const inputData = await successController.setSuccessfulPayments(billingInfo);
    
    if (!stripe_testing.checkInputData(inputData)){throw new Error('Your 15min has passed. Please try again.')}

    res.send(JSON.stringify(inputData));
    // res.send(inputData);
  } catch (e){
    console.log("error"+e);
    res.sendStatus(404);
    res.end();
  }
  
});

router.post('/create-checkout-session', async (req, res) => {
  
  // WIP for data to be added to database.
  // const { quantity } = req.body;
  console.log("here");
  //console.log(req.body);

  const state = JSON.stringify(req.body);
  // const {billing, body, roomType, message} = (req.body);
  // console.log(state);
  // console.log(req.body.billing);
  // console.log(JSON.stringify(req.body.billing));

  const billing = JSON.parse(req.body.billing);
  const info = JSON.parse(req.body.info);
  info.message = req.body.paragraph_text;
  info["destination"] = billing.destination;
  info["unit_amount"] = billing.unit_amount;
  //console.log(state.info);

  // const { date, message, roomType, options } = req.body;

  const diffInMs = Math.abs(info.end - info.start);
  console.log("start: " + info.start + " end: "+ info.end+" "+diffInMs);
  
  const numOfNights = Math.ceil(diffInMs/(1000 * 60 * 60 * 24));

  const setStart = new Date(info.start-4);
  const setEnd = new Date(info.end);

  const startDate = setStart.getDate() + "/"+setStart.getMonth() + "/" + setStart.getFullYear();
  const endDate = setEnd.getDate() + "/"+setEnd.getMonth() + "/" + setEnd.getFullYear();

  const description = "Number of Nights: " + 
  numOfNights + " \nStart Date: " + startDate
  + " \nEnd Date: " + endDate + " \nNumber of Adults: "
  + info.adultQuantity + " \nNumber of Children: "
  + info.childrenQuantity + " \nRoom Type: " + info.roomType
  + " \nComments for hotel: " + info.message

  info["startDate"] = startDate;
  info["endDate"] = endDate;

  const nameStr = info.hotelName;

  const product = await stripe.products.create({
    name: nameStr,
    // description: "Contains: Number of nights, start date, end date, adults, children, message to hotel, room types",
    description: description
  });

  console.log(product.id);
  console.log(billing.unit_amount);

  const price = await stripe.prices.create({
      unit_amount: billing.unit_amount *100,
      currency: 'sgd',
      // product: 'prod_M0kZOf836DEs60',
      product: product.id,
  });

  // console.log(price.id);
  // console.log(numOfNights);
  // console.log(info.roomQty);

  const session = await stripe.checkout.sessions.create({
    
      line_items: [
      {
        // price: 'price_1LIj48Gixach2Gt0JfKGc1wS',
        price: price.id,
        quantity: numOfNights * info.roomQty,
      },
    ],
    mode: 'payment',
    customer_creation: "always",
    success_url: `${process.env.CLIENT_URL}/checkout/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout/canceled/${parseInt(req.body.currentTime)}`,
    billing_address_collection: 'required',
    phone_number_collection: {"enabled": true},
  });

  // add the state info to database with the session id as key first
  const pre_payment_inp = {
    sessionId: session.id,
    billing: billing,
    info: info,
    pageURL: req.body.pageURL,
    curTime: parseInt(req.body.currentTime)
  }

  const store = incompleteController.setIncompletePayments(pre_payment_inp, true);
  store;

  console.log("Redirecting to 303")
  res.redirect(303, session.url);  

});

// router.post('/webhook', async (req, res) => {
//     let data;
//     let eventType;
//     // Check if webhook signing is configured.
//     if (process.env.STRIPE_WEBHOOK_SECRET) {
//       // Retrieve the event by verifying the signature using the raw body and secret.
//       let event;
//       let signature = req.headers['stripe-signature'];
  
//       try {
//         event = stripe.webhooks.constructEvent(
//           req.rawBody,
//           signature,
//           process.env.STRIPE_WEBHOOK_SECRET
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed.`);
//         return res.sendStatus(400);
//       }
//       // Extract the object from the event.
//       data = event.data;
//       eventType = event.type;
//     } else {
//       // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//       // retrieve the event data directly from the request body.
//       data = req.body.data;
//       eventType = req.body.type;
//     }
  
//     if (eventType === 'checkout.session.completed') {
//       console.log(`🔔  Payment received!`);
//     }
  
//     res.sendStatus(200);
//   });
  
  // app.listen(8080, () => console.log(`Node server listening on port ${4242}!`));

  module.exports = router;