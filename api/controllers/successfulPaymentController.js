var https = require('https')
var { MongoClient } = require("mongodb");
var axios = require("axios");
const { constants } = require('fs');
const { resourceLimits } = require('worker_threads');
const { Console } = require('console');
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
// const baseUrl = 'https://hotelapi.loyalty.dev/api/'

const dbName = "ascenda-hotel-booking"
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const fin_coll_name = "successful_payments";
const mid_coll_name = "incomplete_payments";


module.exports.setSuccessfulPayments = async function (newListing, resPage){
// const setSuccessfulPayments = async function (newListing){
    
    var finJSON = {};
    try {
        await client.connect();
        const dbo = client.db(dbName);
        const collec = dbo.collection(fin_coll_name);
        const mid_collec = dbo.collection(mid_coll_name);
        // console.log("in successful controller");

        console.log('sessionID = '+ newListing.sessionId)

        const oldListingQuery = await mid_collec.find({"sessionId": newListing.sessionId});
        const oldListing = await oldListingQuery.toArray();
        console.log(oldListing[0]);
        // console.log("finished old listing");
        // console.log(oldListing[0]);
        // console.log(JSON.stringify(oldListing[0].info));
        // console.log(JSON.stringify(newListing));

        finJSON = {
            id: newListing.sessionId,
            state: oldListing[0].info,
            billing: newListing,
        }
        // console.log("succesfully created new json: ");
        // console.log(JSON.stringify(finJSON));
        // console.log("finJSON");
        // console.log(finJSON);

        // const session = await stripe.checkout.sessions.retrieve(sessionId);
        const result = await collec.insertOne(finJSON);
        result;

        console.log("complete insertion into succesful collection");

        await deleteDocument();
        console.log("finish deleting old files");

        // const rtn = await queryData(newListing.sessionId);
        // console.log(rtn);

    } finally { // closing connection no matter what
        console.log("successful payment created");
        // client.close()
    }

    console.log("print finJSON");
    console.log(finJSON);

    // return(JSON.stringify(finJSON))
    while(finJSON == null || finJSON.length == 0){
        console.log("waiting for finJSON");
    };

    // if (finJSON != null && finJSON.length != 0){
    //     console.log("Found in database");
    //     resPage.write(JSON.stringify(result));
    //     resPage.end();
    // }

    return finJSON;
}

async function deleteDocument(){
    try {
        await client.connect();
        const dbo = client.db(dbName);
        const mid_collec = dbo.collection(mid_coll_name);
        const maxTime = Date.now() - (1000 * 60 * 15);
        

        console.log(maxTime);
        await mid_collec.deleteMany({ "curTime": { $lt: maxTime } });
        console.log("maxTime deleted");

    } finally { // closing connection no matter what
        console.log("intermediate payment deleted");
    }

}

// module.exports.queryData = async function (id){
// async function queryData(id){

//     let rtn = "";
//     try {
//         // await client.connect();
//         const dbo = client.db(dbName);
//         const collec = dbo.collection(mid_coll_name);

//         const result = await collec.find({sessionId:id});

//         //const printedResult = await result.toArray();

//         console.log("succesfully queried new json: ");
//         const rtn = JSON.parse(JSON.stringify(result));

        

//     } finally { // closing connection no matter what
//         console.log("successful query created");
//     }

//     return rtn;

// }

