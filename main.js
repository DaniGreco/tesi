// OPEN SERVER
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Server test');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// CONNECT SERVER TO DATABASE
//const user = encodeURIComponent('root');
//const pass = encodeURIComponent('12345');
//const authMechanism = "DEFAULT";
const { MongoClient } = require('mongodb');
const url = 'localhost:27017';
const uri = `mongodb://${url}`;
const client = new MongoClient(uri);

async function establishConnection() {
    try {
        // connect client to server
        await client.connect();
        // establish and verify connection
        await client.db('admin').command({ ping: 1 });
        console.log(`Connected successfully to server at ${uri}\n`);

        const db = client.db('bikesDB');
        const coll = db.collection("bikes");

        //await coll.drop();
        db.admin().listDatabases().then(function (databases) { console.log(databases) });

        /**/
        coll.find({ id: 1700354 }).forEach(res =>{
            console.log(res);
        });
        
        //function(error, result) {
        //    if(err) throw err;
        //    console.log(result);
        //});
        
    } catch (error) {
        console.error(error);
    }
    //finally {
    //close client when finish/error
    //    await client.close();
    //}
}
establishConnection().catch(console.dir);

/*
// WRITE/READ/DROP TEST COLLECTION
async function inDocOutDocDelDoc() {

    // db and collection creation

    // insert doc in collection
    const doc = { hello:1 , ciao:2 , halo:3 };
    const result = await coll.insertOne(doc);
    console.log(result);

    // print collection
    const cursor = coll.find();
    await cursor.forEach(console.dir);

    // drop collection
    //await coll.drop();

    // insert doc1 in collection
    const doc1 = { hello:4 , ciao:5 , halo:6 };
    const result1 = await coll.insertOne(doc1);
    console.log(result1);

    // print collection
    const cursor1 = coll.find();
    await cursor1.forEach(console.dir);

    // show all databases
    db.admin().listDatabases().then(function(databases){console.log(databases)});
    // drop collection
    // await coll.drop();

    // show all databases
    // myDB.admin().listDatabases().then(function(databases){console.log(databases)});
}
inDocOutDocDelDoc();
*/

