var https = require('https')
var async = require('async')
var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

var query = require("../public/javascripts/dbops").query
var update = require("../public/javascripts/dbops").update

const coll_name = "hotels"
const mid_url = "hotels/"
// get static details for a given hotel
exports.getOneHotel = async function(req, resPage, next) {

    let promise0 = client.connect();
    promise0.then(()=>{
        // 1. check if it is in database
        const hotel_id = req.params.id
        
        let promise = query(client,dbName,coll_name,{id:hotel_id})
        promise.then((result)=>{
            console.log(result)
            // 2. if so: display it
            if (result != null && result.length > 0 && result[0].hasOwnProperty("address")){
                console.log("Found in database");
                resPage.write(JSON.stringify(result[0]));
                resPage.end();
            
            }
            // 3. if not: request api, display & store in database
            else{
                console.log("Not found in database")
                const url = baseUrl+mid_url+hotel_id
                try{
                    https.get(url, res => {
                        let data = '';
                        res.on('data', chunk => {
                            data += chunk;
                            });
                        res.on('end', () => {
                            data = JSON.parse(data);
                            
                            if (JSON.stringify(data).length <=2 ){
                                resPage.sendStatus(404);
                                resPage.end();
                                return ;
                            }
                            
                            // storing and displaying at the same time
                            console.log("value"+JSON.stringify(data).length)
                            update(client,dbName,coll_name,data,{id:hotel_id},"set").catch(console.dir);
                            resPage.write(JSON.stringify(data));
                            resPage.end();
                        })
                    })
                }
                catch(e){
                    console.log("error"+e);
                    resPage.sendStatus(404);
                    resPage.end();
                }


            }
        })
    })

  };


