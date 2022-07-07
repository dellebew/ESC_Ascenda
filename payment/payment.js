require("dotenv").config()

// This is your test secret API key.
console.log("here1")
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const express = require('express');
const app = express();

const path = require('path');

app.use(express.static('.'));

// var PaymentRouter = require('./payment_checkout.html');
// app.use('/', PaymentRouter);

app.get('/', async (req, res) => {
  res.sendFile(path.resolve(__dirname, './payment_checkout.html'))
})


app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1LIj48Gixach2Gt0JfKGc1wS',
        quantity: 1
      },
    ],
    mode: 'payment',
    customer_creation: "always",
    success_url: `${process.env.CLIENT_URL}?success=true`,
    cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
    billing_address_collection: 'required',
    phone_number_collection: {"enabled": true},
  });
  console.log("Redirecting to 303")
  res.redirect(303, session.url);

  //temporarily store in sessionStorage or localStorage
  console.log(session.id)
  // const sessionData = await stripe.checkout.sessions.retrieve(session.id);
  sessionStorage.setItem("customerData", JSON.stringify(session.id))
  // var test = JSON.parse(sessionStorage.getItem("sessionData"));
  // console.log(test);
});

app.listen(4242, () => console.log('Running on port 4242'));