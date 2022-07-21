require("dotenv").config()
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

function checkoutSession () {
    async (props) => {
  
        // WIP for data to be added to database.
        // const { quantity } = req.body;
        console.log("here");
        //console.log(req.body);
      
        // const state = JSON.stringify(req.body);
        const state = (props.body);
      
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
    }
}

export default checkoutSession;