function query_db(db_name,coll_name,find_condition,connection_string,identifier=NaN){
    const { MongoClient } = require("mongodb");

    // MongoDB deployment's connection string
    const uri = connection_string;

    const client = new MongoClient(uri);

    const res = Array();

    async function run() {
    try {
        const db = client.db(db_name);
        const coll = db.collection(coll_name);

        await client.connect();
        const cursor = coll.find(find_condition); // find with queries
        await cursor.forEach(a => {
            if (identifier != NaN){
                res.push(a[identifier]);
            }
            else{
                res.push(a);
            }
            
        })
        return res;


    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    }
    return run().catch(console.dir);
}

// demo
const connection_string = "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority";
let promise1 = query_db("ascenda-hotel-booking","destinations",{term:"Istanbul, Turkey"},connection_string,"uid")
promise1.then(result => {
    // do sth with the result
    console.log(result); 
 })
