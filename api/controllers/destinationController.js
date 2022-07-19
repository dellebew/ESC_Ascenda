var https = require('https')
var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

var query = require("../public/javascripts/dbops").query
var update = require("../public/javascripts/dbops").update

const coll_name = "destination_hotels"
const mid_url = "hotels?destination_id="
const page_size = 20

// hotels belonging to a particular destination
exports.getDestinationHotelIds = async function(req, resPage, next) {

        let promise0 = client.connect();
        promise0.then(()=>{
            // 1. check if it is in database
            const destination_id = req.params.id;
            const page_num = parseInt(req.params.page)
            
            let promise = query(client,dbName,coll_name,{id:destination_id})
            promise.then((result)=>{
                console.log("result: "+result)
    
                // 2. if so: display it
                if (result != null && result.length != 0){
                    console.log("Found in database");
                    resPage.write(JSON.stringify([parseInt(result[0].hotels[0].length/page_size),result[0].hotels[0].slice(page_num*page_size,(page_num+1)*page_size)]));
                    resPage.end();
                
                }
                // 3. if not: request api, display & store in database
                else{
                    console.log("Not found in database")

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

                            update(client,dbName,coll_name,data,{id:destination_id},"addToSet").catch(console.dir);
                            console.log(Object.keys(data))
                            resPage.write(JSON.stringify([parseInt(data.length/page_size),data.slice(page_num*page_size,(page_num+1)*page_size)]));       
                            resPage.end();
                        })
                    })
    
                }
            })
        })
        
      };
    