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

module.exports.setIncompletePayments = async function (newListing, set){
    
    let rtnStatement = {link: "/"};
    try {
        await client.connect();
        const dbo = client.db(dbName);
        const collec = dbo.collection(mid_coll_name);

        if (set){
            // newListing is a JSON file
            // const session = await stripe.checkout.sessions.retrieve(sessionId);
            const result = await collec.insertOne(newListing);
        } else {
            // newListing = sessionID
            console.log("newListing: "+ newListing);
            const oldListingQuery = await collec.find({"curTime": parseInt(newListing)});
            // const oldListingQuery = await collec.find({});
            const oldListing = await oldListingQuery.toArray();
            
            console.log("the queried listing: ", oldListing[0]);
            const rtnStatementlink = await oldListing[0].pageURL;
            rtnStatement = {link: rtnStatementlink}
        }   
        

    } catch(e) { // closing connection no matter what
        // await client.close();
        console.log("mid payment cannot be accessed");
        console.log(e);
    }
    
    console.log(JSON.stringify(rtnStatement));
    return JSON.stringify(rtnStatement);
}