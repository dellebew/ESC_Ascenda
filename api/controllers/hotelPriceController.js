var axios = require('axios')
var promiseWaterfall = require('promise.waterfall')
var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const baseUrl = 'https://hotelapi.loyalty.dev/api/'
const dbName = "ascenda-hotel-booking"

var query = require("../public/javascripts/dbops").query
var update = require("../public/javascripts/dbops").update

const coll_name = "hotel_price"

// price for a given hotel (with filtering conditions)
exports.getHotelPrice = async function(req, resPage, next) {

    let promise0 = client.connect();
    promise0.then(()=>{
        // 0. get filter data
        requirements_list = getFilteredData(req.params);
        const url = get_hotel_price_url(requirements_list);
        const requirements = get_requirements(requirements_list);

        // 1. check if it is in database
        // query by requirements = requirements

        let promise = query(client,dbName,coll_name,{requirements:requirements})
        promise.then((result)=>{

            // 2. if so: display it
            if (result != null && result.length != 0 && result[0].completed != false){
                console.log("Found in database");
                resPage.write(JSON.stringify(result));
                resPage.end();
                
            }
            // 3. if not: request api, display & store in database
            else{
                console.log("Not found in database")
                try{
                // waterfall
                promiseWaterfall([
                    call_axios(url),
                    setTimeout(()=>{call_axios(url).then((r)=>{
                        if (r == null){
                            resPage.sendStatus(404);
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
                            const total_page_count = parseInt(data.hotels.length/page_size)
                            
                            // get hotels static data
                            // start **********************
                            const promises = [];
                            for (let i = 0; i < page_size; i++) {     
                                try{
                                        const hotel_id = data.hotels[i].id
                                        promises.push(getOneStaticHotel(hotel_id));
                                }   
                                catch{
                                    resPage.sendStatus(404);
                                    resPage.end();
                                    console.log("error id")
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
                                        const arr = Array()
                                        arr.push(total_page_count)
                                        arr.push(write_array)
                                        resPage.write(JSON.stringify(arr))
                                        resPage.end();
                                })
                                    })                     
                        }
                    })
                    },3500)
                    
                  ])
            // waterfall
            promiseWaterfall([
                call_axios(url),
                setTimeout(()=>{call_axios(url).then((r)=>{
                    if (r == null){
                        resPage.sendStatus(404);
                        resPage.end();
                        return null;
                    }
                    else{ return r}
                }).then((data)=>{
                    if (data.rooms != null){
                        update(client,dbName,coll_name,data,{requirements:requirements},"set").catch(console.dir);
                        resPage.write(JSON.stringify([data]))
                        resPage.end();
                        }
                    })                     
                    
               
                },2000)
                
              ])
                }
                catch(err){
                    console.log("error"+err);
                    resPage.sendStatus(404);
                    resPage.end();
                }                    


            }
        })
    })
   
  };

  async function call_axios(url){
    const response = await axios.get(url)
    console.log(response.data.completed)
    return response.data
}
  // TODO
function getFilteredData(req){
    var hotelid = req.hotelid
    var destinationid = req.destinationid
    var checkin = req.checkin
    var checkout = req.checkout
    var lang = req.lang
    var currency = req.currency
    var countrycode2 = req.countrycode2
    var guestnumber = req.guestnumber

    requirements_list = [hotelid,destinationid,checkin,checkout,lang,currency,countrycode2,guestnumber]
    console.log("requirements_list"+requirements_list)

    ///diH7/price?destination_id=WD0M&checkin=2022-07-15&checkout=2022-07-16&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1
    // requirements_list =["diH7", "WD0M","2022-07-25","2022-07-29","en_US","SGD","SG","2"] // testing

    return requirements_list;
}

function get_hotel_price_url(requirements_list){
    var hotel_id = requirements_list[0]
    var destination_id = requirements_list[1]
    var checkin = requirements_list[2]
    var checkout = requirements_list[3]
    var lang = requirements_list[4]
    var currency = requirements_list[5]
    var country_code2 = requirements_list[6]
    var guest_number = requirements_list[7]
    const url = baseUrl+"hotels/"+hotel_id+"/price?destination_id="+destination_id+"&checkin="+checkin+"&checkout="+checkout+"&lang="+lang+"&currency="+currency+"&country_code="+country_code2+"&guests="+guest_number+"&partner_id=1"
    return url;
}

function get_requirements(requirements_list){
    var hotel_id = requirements_list[0]
    var destination_id = requirements_list[1]
    var checkin = requirements_list[2]
    var checkout = requirements_list[3]
    var lang = requirements_list[4]
    var currency = requirements_list[5]
    var country_code2 = requirements_list[6]
    var guest_number = requirements_list[7]
    const requirements = hotel_id+"-"+destination_id+"-"+checkin+"-"+checkout+"-"+lang+"-"+currency+"-"+country_code2+"-"+guest_number
    return requirements;
}