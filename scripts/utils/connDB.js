// CONNECT SERVER TO DATABASE
import { MongoClient } from 'mongodb';
//const user = encodeURIComponent('root');
//const pass = encodeURIComponent('12345');
//const authMechanism = "DEFAULT";

const url = 'localhost:27017';
const uri = `mongodb://${url}`;
const client = new MongoClient(uri);
let db;
let coll;

export async function establishConnection() {
    try {
        // connect client to server
        await client.connect();
        // establish and verify connection
        await client.db('admin').command({ ping: 1 });

        console.log(`Connected successfully to server at ${uri}`);
        db = client.db('bikesDB');
        coll = db.collection('bikes');
        //coll.listIndexes().forEach(index => console.log(index));
        //db.admin().listDatabases().then(function(databases){console.log(databases)});
    } catch (error) {
      console.error(error);
    }
}

export async function closeConnection() {
    await client.close();
}

export async function addBike(bike) {
    return await coll.insertOne(bike);
}

export async function printData() {
    await coll.find().forEach(console.dir);
}

export async function dropColl() {
    await coll.drop();
}