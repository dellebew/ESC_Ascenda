var https = require('https')
var { MongoClient } = require("mongodb");
const { options } = require('../routes');
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

var query = require("../public/javascripts/dbops").query
var update = require("../public/javascripts/dbops").update

const coll_name = "destination_prices"

// hotel prices for a given destination (with filtering conditions)
exports.getDestinationHotelPrices = function(req, resPage, next) {

    let promise0 = client.connect();
    promise0.then(()=>{
        // 0. get filter data
        requirements_model = getFilteredData();
        const url = get_destination_prices_url(requirements_model);
        const requirements = get_requirements(requirements_model);

        // 1. check if it is in database
        // query by requirements = requirements

        let promise = query(client,dbName,coll_name,{requirements:requirements})
        promise.then((result)=>{
            // console.log(result[0].hotels.length)
            // 2. if so: display it
            if (result != null && result.length != 0 && result[0].hotels.length != 0){
                console.log("Found in database");
                resPage.write(JSON.stringify(result));
                resPage.end();
                
            }
            // 3. if not: request api, display & store in database
            else{
                console.log("Not found in database")
                const value = Array();
                https.get(url,res => {
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
                        update(client,dbName,coll_name,value[0],{requirements:requirements},"set").catch(console.dir);
                        resPage.write(JSON.stringify(value[0]));
                        resPage.end();
                        
                        })
                    })
                
                
                
            
                

            }
        })
    })
   
    
    // let promise2 = client.close();
    // promise2.then(()=>{
    //     return;
    // })
  };
  // TODO
function getFilteredData(){
    // retrieve data from form
    // ...
    requirements_tuple = [ "WD0M","2022-07-19","2022-07-20","en_US","SGD","SG","2"] //test
    return requirements_tuple;
}


function get_destination_prices_url(requirements_list){
    var destination_id = requirements_list[0]
    var checkin = requirements_list[1]
    var checkout = requirements_list[2]
    var lang = requirements_list[3]
    var currency = requirements_list[4]
    var country_code2 = requirements_list[5]
    var guest_number = requirements_list[6]
    // https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=WD0M&checkin=2022-07-17&checkout=2022-07-18&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1
    const url = baseUrl+"hotels/prices?destination_id="+destination_id+"&checkin="+checkin+"&checkout="+checkout+"&lang="+lang+"&currency="+currency+"&country_code="+country_code2+"&guests="+guest_number+"&partner_id=1"
    console.log("url"+url)
    // return "https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=cm8g&checkin=2022-07-22&checkout=2022-07-25&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1"
               https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=2022-07-19&checkin=2022-07-20&checkout=en_US&lang=SGD&currency=SG&country_code=2&guests=undefined&partner_id=1
    return url

}

function get_requirements(requirements_list){
    var destination_id = requirements_list[1]
    var checkin = requirements_list[2]
    var checkout = requirements_list[3]
    var lang = requirements_list[4]
    var currency = requirements_list[5]
    var country_code2 = requirements_list[6]
    var guest_number = requirements_list[7]
    const requirements = destination_id+"-"+checkin+"-"+checkout+"-"+lang+"-"+currency+"-"+country_code2+"-"+guest_number
    return requirements;
}
