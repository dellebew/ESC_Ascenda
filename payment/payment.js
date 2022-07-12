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

// send to database
// app.get('/retrieve-sessions', async (req, res) => {
//   const sessions = await stripe.checkout.sessions.list({
//     limit: 3,
//   });

//   for (int i; i< sessions.data.length(); i++){
//     const id = sessions.data[i].id;
//     const 
//   }

// })

app.post('/create-checkout-session', async (req, res) => {
  const product = await stripe.products.create({
      name: 'Hotel Name',
      description: "Contains: Number of nights, start date, end date, adults, children, message to hotel, room types",
  });
  console.log(product.id)
  
  const price = await stripe.prices.create({
      unit_amount: 20*100,
      currency: 'sgd',
      // product: 'prod_M0kZOf836DEs60',
      product: product.id,
  });

  console.log(price.id)
  
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price: 'price_1LIj48Gixach2Gt0JfKGc1wS',
        price: price.id,
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
});

//console.log(session.id)

//post data to 
//sessionStorage.setItem("sessionID", JSON.stringify(session.id))
// var test = JSON.parse(sessionStorage.getItem("sessionData"));
// console.log(test);

// const sessionID = sessionStorage.getItem("sessionID");
// const sessionData = await stripe.checkout.sessions.retrieve(session.id);
// sessionStorage.setItem("sessionData", JSON.stringify(sessionData))
// const data = sessionStorage.getItem("sessionData");
// console.log(data);



app.listen(4242, () => console.log('Running on port 4242'));