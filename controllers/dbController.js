const https = require('https')
var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);


// var insert = require("../public/javascripts/dbops").insert
// var query = require("../public/javascripts/dbops").query
// var update = require("../public/javascripts/dbops").update
// var del = require("../public/javascripts/dbops").del

const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

// add static details for a given hotel
exports.addOneHotel = function(req, resPage, next) {
    
    const value = Array();
    const hotelId = req.params.id;
    const url = baseUrl+"hotels/"+hotelId
    // resPage.send(url)
    https.get(url, res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
    });
    res.on('end', () => {
        data = JSON.parse(data);
        value.push(data);
        // resPage.send(value);
        update(client,dbName,"hotels",value[0],{id:hotelId},"set").catch(console.dir);
    })
    }).on('error', err => {
    console.log(err.message);
    })
    next();
    
  };


// hotels belonging to a particular destination(store id only)
exports.addDestinationHotelIds = function(req, resPage, next) {
    
  const value = Array();
  var ids = Array();

  const destinationId = req.params.id;
  const url = baseUrl+"hotels?destination_id="+destinationId
  console.log(url)
  https.get(url, res => {
  let data = '';
  res.on('data', chunk => {
      data += chunk;
  });
  res.on('end', () => {
      data = JSON.parse(data);
      value.push(data);
      value[0].forEach(e=>ids.push(e.id));
      update(client,dbName,"destination_hotels",ids,{id:destinationId},"addToSet").catch(console.dir);

      
  })
  }).on('error', err => {
  console.log(err.message);
  })
  next();
  
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

async function query(client,dbName,collection,find_condition) {
    try {
      await client.connect();
  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
  
      // find data
      const cursor = coll.find(find_condition); // find with queries
      const res = Array();
      await cursor.forEach(e => {
          if (identifier != NaN){
              res.push(e[identifier]);
          }
          else{
              res.push(e);
          }
          
      })
      return res;  
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  
async function update(client,dbName,collection,docs,filter,op) {
    try {
      await client.connect();
  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
      
      console.log("filter"+filter);
      // update 
      if (op == "set"){
        const result = await coll.updateMany(
          filter, 
          {$set:{hotels:docs}},
          {
            upsert: true,
            multi: true
          });
          console.log("Number of documents updated: " + result.modifiedCount);

      }
      else if (op == "addToSet"){
        const result = await coll.updateMany(
          filter, 
          {$addToSet:{hotels:docs}},
          {
            upsert: true,
            multi: true
          });
          console.log("Number of documents updated: " + result.modifiedCount);

      }
 
      // display the results of your operation
 
  
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

// exports.insert = insert()
// exports.query = query()
// exports.update = update()
// exports.del = del()