// guids on mongodb atlas operations for reference


// how to import a local file:
// mongoimport --uri "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority" --collection destinations --drop --db ascenda-hotel-booking  --file ../data/destinations.json --jsonArray
const { MongoClient } = require("mongodb");
// const express = require('express');
// const app = express()
// var bodyParser = require('body-parser');
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));
const fs = require('fs');

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// var docs;
// // read JSON object from file
// fs.readFileSync('../data/destinations.json', 'utf-8', (err, data) => {
//     if (err) {
//         throw err;
//     }

//     // parse JSON object
//     docs = JSON.parse(data.toString());

//     // print JSON object
//     console.log(docs[0].term);

// });
async function run() {
  try {
    await client.connect();

    // database and collection code goes here
    const db = client.db("ascenda-hotel-booking");
    // const coll = db.collection("planets");
    const coll = db.collection("destinations");
    // find code goes here
    // const cursor = coll.find(); // find all
    // const cursor = coll.find({orderFromSun: 2,hasRings: false}); // find with queries
    const cursor = coll.find({term:"Istanbul, Turkey"}); // find with queries
    // // fine with dot notation as module; $lt: less than; multiple conditions
    // const cursor = coll.find({"surfaceTemperatureC.mean": { $lt: 15 }, "surfaceTemperatureC.min": { $gt: -100 }, }); 
    // const cursor = coll.find({$and: [{ orderFromSun: { $gt: 2 } }, { orderFromSun: { $lt: 5 } }],}); // $or

    // insert data
    
    // insert code goes here
    // If you omit the _id field, the driver automatically generates a unique ObjectId value for the _id field.

    // const docs = [
    //   {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
    //   {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
    //   {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12}
    // ];
    
      // const result = await coll.insertMany([docs]);
          
      // display the results of your operation
      // console.log(result.insertedIds);

    // const result = await coll.insertMany(docs);

    // // display the results of your operation
    // console.log(result.insertedIds);

    // update code goes here
    // const filter = { };
    // const updateDoc = {
    //   $mul: {
    //       radius: 1.60934
    //   }
    // };

    // const result = await coll.updateMany(filter, updateDoc);
    // // display the results of your operation
    // console.log("Number of documents updated: " + result.modifiedCount);

    // delete code goes here
    // const doc = {orbitalPeriod: { $gt: 100 }};

    // const result = await coll.deleteMany(doc);
    // // amount deleted code goes here
    // console.log("Number of documents deleted: " + result.deletedCount);


    // const cursor = coll.find();

    // iterate code goes here
    await cursor.forEach(a => console.log(a.uid)); // await: cause the runtime to wait for the operation. easier than specifying a callback, or chaining a promise.


  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
