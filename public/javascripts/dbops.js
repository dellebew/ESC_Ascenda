module.exports.insert = insert;
module.exports.query = query;
module.exports.update = update;
module.exports.del = del;

async function insert(client,dbName,collection,docs) {
  // docs is an Array()
    try {
      await client.connect();
  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
  
      // insert data
      const result = await coll.insertMany(docs);
      console.log(result);   
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  async function query(client,dbName,collection,filter) {
    try {
      await client.connect();
  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
  
      // find data
      const cursor = coll.find(filter); // find with queries
      const res = Array();
      await cursor.forEach(e => {
          res.push(e);
          // console.log("query: "+e);
      })

      return res;  
  
    } 
    catch{
      console.log("error in query")
      return null;
    }
    
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  
async function update(client,dbName,collection,docs,filter,op) {
    try {
      await client.connect();
  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
      
      console.log("filter"+filter);
      // update 
      if (op == "set"){
        const result = await coll.updateMany(
          filter, 
          {$set:{hotels:docs}},
          {
            upsert: true,
            multi: true
          });
          console.log("Number of documents updated: " + result.modifiedCount);

      }
      else if (op == "addToSet"){
        const result = await coll.updateMany(
          filter, 
          {$addToSet:{hotels:docs}},
          {
            upsert: true,
            multi: true
          });
          console.log("Number of documents updated: " + result.modifiedCount);

      }
 
      // display the results of your operation
 
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

async function del(client,dbName,collection,doc) {
    try {
      await client.connect();
  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
    
      // delete 
      const result = await coll.deleteMany(doc);
      // amount deleted code goes here
      console.log("Number of documents deleted: " + result.deletedCount);
 
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }