var https = require('https')
var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

var query = require("../public/javascripts/dbops").query
var update = require("../public/javascripts/dbops").update
// var hotelController = require("../controllers/hotelController");

const coll_name = "destination_hotels"
const mid_url = "hotels?destination_id="

// hotels belonging to a particular destination
exports.getDestinationHotelIds = async function(req, resPage, next) {
    let promise0 = client.connect();
    promise0.then(()=>{
        // 1. check if it is in database
        let promise = query(client,dbName,coll_name,{id:req.params.id})
        promise.then((result)=>{

            // 2. if so: display it
            if (result != null && result.length != 0){
                console.log("Found destination in database");
                console.log("result 1: "+JSON.stringify(result))
                result[0].hotels.forEach((hotel_id)=>{
                    // resPage.write(JSON.stringify(hotel_id));
                    getOneHotelLoop(req, resPage, next, hotel_id)
                })
                
                resPage.end();
                
            }
            // 3. if not: request api, display & store in database
            else{
                console.log("Not found destination in database")
                const value = Array();
                const destination_id = req.params.id;
                const url = baseUrl+mid_url+destination_id
                
                https.get(url, res => {
                    let data = '';
                    res.on('data', chunk => {
                        data += chunk;
                        });
                    res.on('end', () => {
                        data = JSON.parse(data);

                        if (data == ''){
                            resPage.write("does not exist");
                            resPage.end();
                            return ;
                        }
                        value.push(data);
                        // storing and displaying at the same time
                        const ids = Array();
                        value[0].forEach(element => {
                            ids.push(element.id)
                            resPage.write(JSON.stringify(element));
                            // update_one_hotel(element.id);
                        });
                        update(client,dbName,coll_name,ids,{id:destination_id},"set").catch(console.dir);
                        resPage.end();
                        
                    })
                })

            }
        })
    })
    let promise2 = client.close();
    promise2.then(()=>{
        return;
    })
  };

async function update_one_hotel(hotel_id){
    const value = Array();
    const url = baseUrl+"hotels/"+hotel_id
    
    https.get(url, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
            });
        res.on('end', () => {
            data = JSON.parse(data);
            value.push(data);
            // storing and displaying at the same time
            // console.log("value"+value)
            update(client,dbName,"hotels",value[0],{id:hotel_id},"set").catch(console.dir);
        })
    })
}
function getOneHotelLoop(req, resPage, next, hotel_id=null) {
    
    // 1. check if it is in database
    if (hotel_id == null){
        hotel_id = req.params.id
    }
    console.log("hotel_id"+JSON.stringify(hotel_id))
    let promise = query(client,dbName, "hotels",{id:hotel_id})
    promise.then((result)=>{
        console.log("result: "+result)
    
        // 2. if so: display it
        if (result != null && result.length != 0){
            console.log("Found hotel in database");
            
            resPage.write(JSON.stringify(result));
            
            // resPage.end();
        
        }
        // 3. if not: request api, display & store in database
        else{
            console.log("Not found hotel in database")
            const value = Array();
            const url = baseUrl+"hotels/"+hotel_id
            console.log("url"+url)
            https.get(url, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                    });
                res.on('end', () => {
                    data = JSON.parse(data);
                    
                    if (data == ''){
                        resPage.write("does not exist");
                        resPage.end();
                        return ;
                    }
                    
                    value.push(data);
                    // storing and displaying at the same time
                    // console.log("value"+value)
                    update(client,dbName,coll_name,value[0],{id:hotel_id},"set").catch(console.dir);
                    resPage.write(JSON.stringify(value));
                    // console.log("value"+JSON.stringify(value))
                    // resPage.end();
                })
            })

        }
    })
    
  };