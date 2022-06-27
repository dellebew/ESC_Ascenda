// retrieve and store in db
var express = require('express');
var router = express.Router();
const https = require('https')

var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);


const baseUrl = 'https://hotelapi.loyalty.dev/api/hotels/'
const id = 'diH7'

const value = Array();
router.get('/', function(req, reso, next) {

    https.get(baseUrl+id, res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
    });
    res.on('end', () => {
        data = JSON.parse(data);
        value.push(data.amenities_ratings);
        reso.send(value[0][0].name)
        run(value[0]).catch(console.dir);
    })
    }).on('error', err => {
    console.log(err.message);
    })

    
  });


async function run(docs) {
  try {
    await client.connect();

    // database and collection code goes here
    const db = client.db("ascenda-hotel-booking");
    const coll = db.collection("planets");
    // const coll = db.collection("destinations");

    // insert data
    const result = await coll.insertMany(docs);
    console.log(result);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}




module.exports = router;