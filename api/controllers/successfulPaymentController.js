var https = require('https')
var { MongoClient } = require("mongodb");
var axios = require("axios");
const { constants } = require('fs');
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
// const baseUrl = 'https://hotelapi.loyalty.dev/api/'

const dbName = "ascenda-hotel-booking"
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const fin_coll_name = "successful_payments";
const mid_coll_name = "incomplete_payments";


exports.setSuccessfulPayments = async function createDocument(newListing){
    
    try {
        await client.connect();
        const dbo = client.db(dbName);
        const collec = dbo.collection(fin_coll_name);
        const mid_collec = dbo.collection(mid_coll_name);

        const oldListing = await mid_collec.find({id: newListing.id});
        
        const finJSON = {
            id: newListing.id,
            state: oldListing.state,
            billing: newListing.billing,
        }

        // const session = await stripe.checkout.sessions.retrieve(sessionId);
        const result = await collec.insertOne(finJSON);

    } finally { // closing connection no matter what
        // await client.close();
        console.log("successful payment created");
    }
}