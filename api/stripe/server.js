require("dotenv").config();
const express = require('express');
const app = express();
var router = express.Router();
const { resolve } = require('path');
var successController = require("../controllers/successfulPaymentController.js");
var incompleteController = require("../controllers/incompletePaymentController.js");
var stripe_testing = require("./server_catches.js");

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
router.get('/failed-checkout-session/:curTime', async (req, res) => {
  
  console.log("in failed server side checkout-session");
  console.log(JSON.stringify(req.params));
  let link = {link: "/"};
  try{
    // ====== parse req.params from cancel.js
    const curTime = req.params.curTime;
    // ====== get link as json from intermediate database
    const queryDataRaw = await incompleteController.setIncompletePayments(curTime, false);
    
    link = JSON.parse(queryDataRaw);
    // ====== send back link as json string 
    res.send(JSON.stringify(link));

  } catch {
    console.log("error");
    res.send({link: "/"})
    res.end();
    // no 404 error as it just sends them back to start payment process again
  }

});
  // Fetch the Checkout Session to display the JSON result on the success page
router.get('/checkout-session/:id', async (req, res) => {
  
  try{
    // ==== parse req.params from success.js
    const sessionId = req.params.id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // ===========

    // retrieve payment id, product id for product name
    const paymentRetrieve = stripe.paymentIntents.retrieve(session.payment_intent);
    const price = paymentRetrieve.amount/100;
    
    // retrieve pre-saved data using sessionid
    const billingInfo = {
      sessionId: session.id,
      name: session.customer_details.name,
      email: session.customer_details.email,
      paymentid: session.payment_intent,
    }
    
    // ======= add data to successful db + delete from intermediate db
    const inputData = await successController.setSuccessfulPayments(billingInfo);
    
    // ======= error catching for time limit
    if (!stripe_testing.checkInputData(inputData)){throw new Error('Your 15min has passed. Please try again.')}
    res.send(JSON.stringify(inputData));

  } catch (e){
    console.log("error"+e);
    res.sendStatus(404);
    res.end();
  }
  
});

router.post('/create-checkout-session', async (req, res) => {

  // parse information from req.body from checkout.jsx
  const billing = JSON.parse(req.body.billing);
  const info = JSON.parse(req.body.info);
  info.message = req.body.paragraph_text;
  info["destination"] = billing.destination;
  info["unit_amount"] = billing.unit_amount;

  const diffInMs = Math.abs(info.end - info.start); 
  console.log("start: " + info.start + " end: "+ info.end+" "+diffInMs);
  // const expiryTime = new Date(parseInt(req.body.currentTime) + (30*60*1000));
  const expiryTime = parseInt(req.body.currentTime) + (31*60*1000);
  
  // set information for input into stripe checkout
  const numOfNights = Math.ceil(diffInMs/(1000 * 60 * 60 * 24));
  const setStart = new Date(info.start);
  const setEnd = new Date(info.end);
  const startDate = setStart.getDate() + "/"+setStart.getMonth() + "/" + setStart.getFullYear();
  const endDate = setEnd.getDate() + "/"+setEnd.getMonth() + "/" + setEnd.getFullYear();

  const nameStr = info.hotelName;
  const description = "Number of Nights: " + 
  numOfNights + " \nStart Date: " + startDate
  + " \nEnd Date: " + endDate + " \nNumber of Adults: "
  + info.adultQuantity + " \nNumber of Children: "
  + info.childrenQuantity + " \nRoom Type: " + info.roomType 
  + "\nRoom Quantity: " + info.roomQuantity
  + " \nComments for hotel: " + info.message

  // create product id for payment id
  const product = await stripe.products.create({
    name: nameStr,
    // description: "Contains: Number of nights, start date, end date, adults, children, message to hotel, room types",
    description: description
  });
  // create payment id for session id
  const price = await stripe.prices.create({
      unit_amount: billing.unit_amount *100,
      currency: 'sgd',
      // product: 'prod_M0kZOf836DEs60',
      product: product.id,
  });
  console.log("here");
  // create session id 
  const session = await stripe.checkout.sessions.create({
    line_items: [
    {
      price: price.id,
      quantity: 1,
    },
    ],
    mode: 'payment',
    customer_creation: "always",
    success_url: `${process.env.CLIENT_URL}/checkout/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout/canceled/${parseInt(req.body.currentTime)}`,
    billing_address_collection: 'required',
    phone_number_collection: {"enabled": true},
  });
  console.log("here");

  // ====== store information into intermediate database ======== //
  // add information for input into intermediate database
  info["startDate"] = startDate;
  info["endDate"] = endDate;
  info["numOfNights"] = numOfNights;
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

  // redirect to stripe checkout page
  console.log("Redirecting to 303")
  res.redirect(303, session.url);  

});

module.exports = router;