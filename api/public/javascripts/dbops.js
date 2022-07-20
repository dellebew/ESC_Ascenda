module.exports.insert = insert;
module.exports.query = query;
module.exports.update = update;
module.exports.del = del;
module.exports.sorted_query = sorted_query;

async function insert(client,dbName,collection,docs) {
  // docs is an Array()

  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
  
      // insert data
      const result = await coll.insertMany(docs);
      console.log(result);   
  
  }

  async function query(client,dbName,collection,filter) {
  
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
      console.log("Number of documents queried: 1");
      return res;  
  }

  // currently only for destination prices
  async function sorted_query(client,dbName,collection,filter) {
  
    // database and collection code goes here
    const db = client.db(dbName);
    const coll = db.collection(collection);

    // find data
    const cursor = coll.aggregate(
[      // Initial document match (uses index, if a suitable one is available)
      { $match: filter},
  
      // Expand the scores array into a stream of documents
      { $unwind: '$hotels' },
  
      // Sort in descending order
      { $sort: {
          'hotels.searchRank': -1
      }}]
  )
    const res = Array();
    await cursor.forEach(e => {
        res.push(e);
        // console.log("query: "+e);
    })
    console.log("Number of documents sort_queried: 1");
    return res;  
}

  
async function update(client,dbName,collection,docs,filter,op) {
  
      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
      
      console.log("filter"+filter);
      // update 
      if (op == "set"){
        const result = await coll.updateMany(
          filter, 
          {$set:docs},
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
 
  }

async function del(client,dbName,collection,doc) {

      // database and collection code goes here
      const db = client.db(dbName);
      const coll = db.collection(collection);
    
      // delete 
      const result = await coll.deleteMany(doc);
      // amount deleted code goes here
      console.log("Number of documents deleted: " + result.deletedCount);
 
  }