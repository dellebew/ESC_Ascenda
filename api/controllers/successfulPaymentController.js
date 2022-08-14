var { MongoClient } = require("mongodb");
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

        const insertExistsRaw = await collec.find({"id": newListing.sessionId});
        const insertExists = await insertExistsRaw.toArray();
        // console.log("insertExists: "+ JSON.stringify(insertExists[0]))

        if (insertExists[0] == null){
            const oldListingQuery = await mid_collec.find({"sessionId": newListing.sessionId});
            const oldListing = await oldListingQuery.toArray();
            console.log(oldListing[0]);
            
            finJSON = {
                id: newListing.sessionId,
                state: oldListing[0].info,
                billing: newListing,
            }
        
            console.log("inserting")
            const result = await collec.insertOne(finJSON);
            result;
            console.log("complete insertion into succesful collection");
        }

        await deleteDocument();
        console.log("finish deleting old files");

        // const rtn = await queryData(newListing.sessionId);
        // console.log(rtn);
        finJSON = insertExists[0];
        console.log(JSON.stringify(finJSON));
        console.log(finJSON.length);
        while(finJSON == null || finJSON.length == 0){
            console.log("waiting for finJSON");
        };

        console.log("successful payment created");

    } catch (e) { // closing connection no matter what
        console.log(e);
        // client.close()
    }

    // console.log("print finJSON");
    console.log(finJSON);

    return finJSON;
}

async function deleteDocument(){
    try {
        await client.connect();
        const dbo = client.db(dbName);
        const mid_collec = dbo.collection(mid_coll_name);
        const maxTime = Date.now() - (1000 * 60 * 15);
        let sessionId = 0;
        
        // const session = await stripe.checkout.sessions.expire(
        //     'cs_test_a1KQj1Gb3wHCiviGdNvwYWCTDiCwHawuivSeDdGUFkb9lEpad8QPKr8J8h'
        //   );

        const oldListingQuery = await mid_collec.find({ "curTime": { $lt: maxTime } });
        const oldListing = await oldListingQuery.toArray();


        for (let i=0; i< oldListing.length; i++){
            console.log("oldListing"+JSON.parse(JSON.stringify(oldListing[i])).sessionId);
            sessionId = JSON.parse(JSON.stringify(oldListing[i])).sessionId;
    
            // check if status is expired
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const expiredRetrieve = stripe.paymentIntents.retrieve(session.status);

            if (expiredRetrieve == "open"){
                const expiration = await stripe.checkout.sessions.expire(
                    sessionId,
                );
            }

        }

        // get all endpoints that should expire
        // console.log(maxTime);
        await mid_collec.deleteMany({ "curTime": { $lt: maxTime } });
        // console.log("maxTime deleted");

    } finally { // closing connection no matter what
        console.log("intermediate payment deleted");
    }

}


