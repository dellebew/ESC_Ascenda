// test database
var test = require('unit.js');
var fs = require('fs')
var { MongoClient } = require("mongodb");
const uri = "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(uri);



var update = require("../public/javascripts/dbops").update
var sorted_query = require("../public/javascripts/dbops").sorted_query
var query = require("../public/javascripts/dbops").query
var del = require("../public/javascripts/dbops").del


async function testdb(client) {
        data = fs.readFileSync("./diH7.json", 'utf-8')
        const dbName = "ascenda-hotel-booking"
        client.connect().then(() => {
                update(client, dbName, "hotels", JSON.parse(data), { id: "diH7" }, "set")
                        .then(() => {
                                setTimeout(() => {
                                        query(client, dbName, "hotels", { id: "diH7" })
                                                .then(res => test.assert(res[0].address == "1 Fullerton Square"))
                                                .then(() => {
                                                        setTimeout(() => {
                                                                del(client, dbName, "hotels", { id: "diH7" })
                                                                        .then(() => {
                                                                                setTimeout(() => {
                                                                                        query(client, dbName, "hotels", { id: "diH7" })
                                                                                                .then(res => test.assert(JSON.stringify(res) == '[]'))
                                                                                                .then(() => {
                                                                                                        setTimeout(() => {
                                                                                                                sorted_query(client, dbName, "destination_prices", { requirements: "2022-07-29-2022-07-30-en_US-SGD-SG-2-undefined" })
                                                                                                                        .then(res => test.assert(res[0].hotels.searchRank == 2))
                                                                                                                        .then(() => {
                                                                                                                                setTimeout(() => {
                                                                                                                                        console.log("passed all tests")
                                                                                                                                        client.close()
                                                                                                                                }, 2000)

                                                                                                                        })


                                                                                                        }, 2000)
                                                                                                }, 2000)
                                                                                }, 2000)

                                                                        }, 2000)

                                                        })
                                                })
                                })
                        })

        }

        )
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