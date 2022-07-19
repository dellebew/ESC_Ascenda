// const {By,Key,Builder} = require("selenium-webdriver");
// require("chromedriver");
 
// async function backend_test1(){
 
//        var searchString = "Automation testing with Selenium";
 
//        //To wait for browser to build and launch properly
//        let driver = await new Builder().forBrowser("chrome").build();
 
//         //To fetch http://google.com from the browser with our code.
//         const url = "http://localhost:8080/api/hotel/diH7"
//         await driver.get(url);
//         // await driver.get("http://google.com");
            
//         //To send a search query by passing the value in searchString.
//         // await driver.findElement(By.name("q")).sendKeys(searchString,Key.RETURN);
//         driver.findElements(By.tagName('head'))
//         .then((e)=>{
//            console.log(e[0])

//         })
//         // driver.getPageSource().then(console.log)
//         //Verify the page title and print it
//         var title = await driver.getTitle();
//         console.log('Title is:',title);
 
//         //It is always a safe practice to quit the browser after execution
//         await driver.quit();
 
// }
 
// backend_test1()


// test database
var test = require('unit.js');
var fs = require('fs')
var promiseWaterfall = require('promise.waterfall')
var { MongoClient } = require("mongodb");
const uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);



var update = require("../public/javascripts/dbops").update
var sorted_query = require("../public/javascripts/dbops").sorted_query
var query = require("../public/javascripts/dbops").query
var del = require("../public/javascripts/dbops").del
var insert = require("../public/javascripts/dbops").insert


async function testdb(client){
        data = fs.readFileSync("./diH7.json",'utf-8')
        const dbName = "ascenda-hotel-booking"
        client.connect().then(()=>{
                promiseWaterfall([
                        update(client,dbName,"hotels",JSON.parse(data),{id:"diH7"},"set"),
                        setTimeout(() =>{query(client,dbName,"hotels",{id:"diH7"}).then((res)=>{
                                // console.log(res)
                                test.assert(res[0].address == "1 Fullerton Square")})} ,2000),
                        
                        setTimeout(()=>{del(client,dbName,"hotels",{id:"diH7"}).then((r)=>{
                                query(client,dbName,"hotels",{id:"diH7"})
                                .then((res)=>{
                                        test.assert(JSON.stringify(res) == '[]')
                                })                      
                        })},2000),
                        sorted_query(client,dbName,"destination_prices",{requirements:"2022-07-29-2022-07-30-en_US-SGD-SG-2-undefined"})
                                .then((res)=>{
                                        console.log("sorted")
                                        test.assert(res[0].hotels.searchRank == 2)
                                }),
                        console.log("passed all tests")
                        
                
                ])
        })

        await client.close()
}


testdb(client)




// // just for example of tested value
// var example = 'hello';
// // assert that example variable is a string
// test.string(example);
// // or with Must.js
// test.must(example).be.a.string();
// // or with assert
// test.assert(typeof example === 'string');