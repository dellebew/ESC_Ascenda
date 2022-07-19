var promiseWaterfall = require('promise.waterfall')
var { MongoClient } = require("mongodb");
var axios = require("axios");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

var update = require("../public/javascripts/dbops").update
var sorted_query = require("../public/javascripts/dbops").sorted_query

const coll_name = "destination_prices"
const page_size = 10
// hotel prices for a given destination (with filtering conditions)
exports.getDestinationHotelPrices = async function(req, resPage, next){
    const page_num = parseInt(req.params.page)
    let promise0 = client.connect();
    promise0.then(()=>{
        // 0. get filter data
        requirements_model = getFilteredData();
        const url = get_destination_prices_url(requirements_model);
        const requirements = get_requirements(requirements_model);

        // 1. check if it is in database
        // query by requirements = requirements

        let promise0 = client.connect();
        promise0.then(()=>{
            let promise = sorted_query(client,dbName,coll_name,{requirements:requirements})
            promise.then((result)=>{

                // 2. if so: display it
                if (result != null && result.length != 0 && result[0].hotels.length != 0){
                    console.log("Found in database");
                    result_cut = result.slice(page_num*page_size,(page_num+1)*page_size);
                    
                    // get hotels static data
                    // start **********************
                    
                    const promises = [];
                    for (let i = 0; i < result_cut.length; i++) {
                        const hotel_id = result_cut[i].hotels.id
                        promises.push(getOneStaticHotel(hotel_id));
                        }
                        
                    Promise.all(promises)
                        .then((full_res) => {   

                        const promises1 = [];
                        for (let i = 0; i < full_res.length; i++) {
                            promises1.push(append_hotel(full_res,result_cut,null,i));
                        }

                        Promise.all(promises1)
                        .then((write_array) => {  
                            // console.log(write_array)
                            resPage.write(JSON.stringify(write_array))
                            resPage.end();
                    })
                        })                     
                        .catch((e) => {console.log(e)});

                        // end**********************

                    
                    }
                // 3. if not: request api, display & store in database
                else{
                    console.log("Not found in database")

                    // waterfall
                    promiseWaterfall([
                        call_axios(url),
                        setTimeout(()=>{call_axios(url).then((r)=>{
                            if (r == null){
                                resPage.write("does not exist");
                                resPage.end();
                                return null;
                            }
                            else{
                                r.hotels.sort(GetSortOrder("searchRank"))
                                return r
                            }
                            
                        }).then((data)=>{
                            console.log("data"+Object.keys(data))
                            if (data.hotels != null){
                                update(client,dbName,coll_name,data,{requirements:requirements},"set").catch(console.dir);
                                
                                // get hotels static data
                                // start **********************
                                const promises = [];
                                for (let i = 0; i < page_size; i++) {     
                                    try{
                                        const hotel_id = data.hotels[i].id
                                        promises.push(getOneStaticHotel(hotel_id));
                                    }   
                                    catch{
                                        console.log("error id")
                                        // process.exit()
                                        // setTimeout()
                                    }                        
                                    }
                                    
                                Promise.all(promises)
                                    .then((full_res) => {   
                                        const promises1 = [];
                                        for (let i = 0; i < full_res.length; i++) {
                                            promises1.push(append_hotel(full_res,null,data,i));
                                        }    
    
                                        Promise.all(promises1)
                                        .then((write_array) => {  
                                            // console.log(write_array)
                                            resPage.write(JSON.stringify(write_array))
                                            resPage.end();
                                    })
                                        })                     
                            }
                        })
                        },3000)
                        
                      ])

                    




                    }
        });
    })
  });
  

}


//Comparator  
function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return -1;    
        } else if (a[prop] < b[prop]) {    
            return 1;    
        }    
        return 0;    
    }    
}

async function getOneStaticHotel(hotel_id){
    const url = baseUrl+"hotels/"+hotel_id
    const res = await axios(url);
    return await res;
}

async function append_hotel(full_res,result_cut,data,i){
    if (result_cut != null){
        if (result_cut[i].hotels.id == full_res[i].data.id){
            result_cut[i].hotels.hotel_data = full_res[i].data
            return result_cut[i].hotels;
        }
        else{
            for (let j = 0; j<full_res.length; j++){
                if (result_cut[j].hotels.id == full_res[i].data.id){
                    result_cut[j].hotels.hotel_data = full_res[i].data
                    return result_cut[i].hotels
                }
            }
        } 
    }
    else if (data != null){

        if (data.hotels[i].id == full_res[i].data.id){
            data.hotels[i].hotel_data = full_res[i].data
            return data.hotels[i];
        }
        else{
            for (let j = 0; j<full_res.length; j++){
                if (data.hotels[i].id == full_res[i].data.id){
                    data.hotels[i].hotel_data = full_res[i].data
                    return data.hotels[i];
                }
        }
        
    }
    
        
}     
}      
    
async function call_axios(url){
    const response = await axios.get(url)
    console.log(response.data.completed)
    return response.data
}

  // TODO
function getFilteredData(){
    // retrieve data from form
    // ...
    requirements_tuple = [ "WD0M","2022-08-28","2022-08-29","en_US","SGD","SG","2"] //test
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
    // https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=WD0M&checkin=2022-07-20&checkout=2022-07-24&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1
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
