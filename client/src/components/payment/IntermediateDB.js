// var { MongoClient } = require("mongodb");
// const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
// var client = new MongoClient(uri);
// // const baseUrl = 'https://hotelapi.loyalty.dev/api/'

// const dbName = "ascenda-hotel-booking"
// const fin_coll_name = "successful_payments";
// const mid_coll_name = "incomplete_payments";

// exports.setIncompletePayments = async function createDocument(newListing){
    
//     try {
//         await client.connect();
//         const dbo = client.db(dbName);
//         const collec = dbo.collection(mid_coll_name);

//         // const session = await stripe.checkout.sessions.retrieve(sessionId);
//         const result = await collec.insertOne(newListing);
//         result;

//     } finally { // closing connection no matter what
//         // await client.close();
//         console.log("mid payment created");
//         await client.close();
//     }
// }
