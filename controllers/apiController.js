var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);


const baseUrl = 'https://hotelapi.loyalty.dev/api/'
// const id = 'diH7'

const dbName = "ascenda-hotel-booking"

// add static details for a given hotel from db
exports.getOneHotel = function(req, resPage, next) {
    
    const hotelId = req.params.id;
    let promise = query(client,dbName,"hotels",{id:hotelId})
    promise.then((res)=>{
        res.forEach(e => resPage.send(e))
        console.log(res);
        next();
    }
    )
  };

// hotels belonging to a particular destination
exports.getDestinationHotels = function(req, resPage, next) {
    
    const destinationId = req.params.id;
    let promise = query(client,dbName,"destinations",{id:destinationId})
    promise.then((res)=>{
        res.forEach(e => resPage.send(e))
        console.log(res);
        next();
    }
    )
  };

// price for a given hotel

// hotel prices for a given destination


// helper
async function insert(client,dbName,collection,docs) {
    // docs is an Array()
      try {
        await client.connect();
    
        // database and collection code goes here
        const db = client.db(dbName);
        const coll = db.collection(collection);
    
        // insert data
        const result = await coll.insertMany(docs);
        console.log(result);   
    
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
  
async function query(client,dbName,collection,filter) {
      try {
        await client.connect();
    
        // database and collection code goes here
        const db = client.db(dbName);
        const coll = db.collection(collection);
    
        // find data
        const cursor = coll.find(filter); // find with queries
        const res = Array();
        await cursor.forEach(e => {
            res.push(e);
            console.log(e.address);
        })

        return res;  
    
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
  
    
async function update(client,dbName,collection,updateDoc,filter) {
      try {
        await client.connect();
    
        // database and collection code goes here
        const db = client.db(dbName);
        const coll = db.collection(collection);
      
        console.log("filter"+filter);
        // update 
        const result = await coll.updateMany(
          filter, 
          {$set:updateDoc},
          {
            upsert: true,
            multi: true
          });
        // display the results of your operation
        console.log("Number of documents updated: " + result.modifiedCount);
   
    
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
  
async function del(client,dbName,collection,doc) {
      try {
        await client.connect();
    
        // database and collection code goes here
        const db = client.db(dbName);
        const coll = db.collection(collection);
      
        // delete 
        const result = await coll.deleteMany(doc);
        // amount deleted code goes here
        console.log("Number of documents deleted: " + result.deletedCount);
   
    
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }