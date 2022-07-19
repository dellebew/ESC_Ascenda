var https = require('https')
var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

var query = require("../public/javascripts/dbops").query
var update = require("../public/javascripts/dbops").update

// hotel prices for a given destination (with filtering conditions)
exports.getDestinationHotelPrices = function(req, resPage, next) {

    let promise0 = client.connect(); 
    promise0.then(()=>{
        // 0. get filter data
    const requirements_tuple = getFilteredData(req);
    
    // 1. check if it is in database
    // filter hotel ids by destination
    const coll_destination_hotels = "destination_hotels"
    const coll_hotel_price = "hotel_price"
    var ids; //array of hotel ids
    
    let promise = query(client,dbName,coll_destination_hotels,{id:req.params.id})
    promise.then((result)=>{
    
        // 2. if so: display it
        if (result != null && result.length != 0){

            console.log("Found destination in database");
            var ids = result.hotels
            missing_hotels = Array();

            ids.array.forEach(hotel_id => {
                
                var requirements = get_requirements(hotel_id,requirements_tuple);

                let promise = query(client,dbName,coll_hotel_price,{requirements:requirements})
                promise.then((result2)=>{
                    if (result2 != null && result2.length != 0){
                        console.log("Found hotel in database");
                        resPage.write(JSON.stringify(value[0]));
                    }
                    else{
                        missing_hotels.push(hotel_id);
                    }
                })

            });

            // update missing hotels
            missing_hotels.array.forEach(hotel_id => {
                var url = get_hotel_price_url(hotel_id,requirements_tuple);
                var requirements = get_requirements(hotel_id,requirements_tuple);

                const value = Array();
                // const hotel_id = req.params.id;
                https.get(url, res => {
                    let data = '';
                    res.on('data', chunk => {
                        data += chunk;
                        });
                    res.on('end', () => {
                        data = JSON.parse(data);
                        value.push(data);
                        // storing and displaying at the same time                    
                        update(client,dbName,coll_hotel_price,value[0],{requirements:requirements},"set").catch(console.dir);
                        resPage.write(JSON.stringify(value[0]));
                        resPage.end();
                        
                    })
                })
            })
            
        }
        // 3. if not: request api, display & store in database
        else{
            console.log("Not found destination in database")
            const value = Array();
            var url = get_destination_prices_url(requirements_tuple)
            var requirements = get_requirements(hotel_id,requirements_tuple);
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

                    var hotel_ids = Array();
                    value.forEach((v)=>{
                        hotel_ids.push(v.id)
                        resPage.write(JSON.stringify(v));
                        update(client,dbName,coll_hotel_price,v,{requirements:requirements},"set").catch(console.dir);

                    })

                    update(client,dbName,coll_destination_hotels,hotel_ids[0],{requirements:requirements},"set").catch(console.dir);
                    
                    resPage.end();
                    
                })
            })

        }
    })
    })
    
    let promise2 = client.close();
    promise2.then(()=>{
        return ;
    })
  };

  // TODO
function getFilteredData(){
    // retrieve data from form
    // ...
    
    return requirements_tuple;
}

function get_hotel_price_url(hotel_id,requirements_tuple){
    destination_id,checkin,checkout,lang,currency,country_code2,guest_number = requirements_tuple
    const url = baseUrl+"hotels/"+hotel_id+"/price?destination_id="+destination_id+"&checkin="+checkin+"&checkout="+checkout+"&lang="+lang+"&currency="+currency+"&country_code="+country_code2+"&guests="+guest_number+"&partner_id=1"
    return url;
}

function get_destination_prices_url(requirements_tuple){
    destination_id,checkin,checkout,lang,currency,country_code2,guest_number = requirements_tuple
    const url = baseUrl+"hotels/prices?destination_id"+destination_id+"&checkin="+checkin+"&checkout="+checkout+"&lang="+lang+"&currency="+currency+"&country_code="+country_code2+"&guests="+guest_number+"&partner_id=1"
    return url;
}

function get_requirements(hotel_id,requirements_tuple){
    destination_id,checkin,checkout,lang,currency,country_code2,guest_number = requirements_tuple
    const requirements = hotel_id+"-"+destination_id+"-"+checkin+"-"+checkout+"-"+lang+"-"+currency+"-"+country_code2+"-"+guest_number
    return requirements;
}
