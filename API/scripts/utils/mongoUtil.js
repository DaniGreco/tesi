// CONNECT SERVER TO DATABASE
import { MongoClient } from 'mongodb';
//const user = encodeURIComponent('root');
//const pass = encodeURIComponent('12345');
//const authMechanism = "DEFAULT";

const url = 'localhost:27017';
const uri = `mongodb://${url}`;
let _db;
let _coll;

export async function establishConnection() {
    try {
        // creating client that connects to db
        const client = new MongoClient(uri);
        // connect client to server
        await client.connect();
        // establish and verify connection
        await client.db('admin').command({ ping: 1 });

        console.log(`Connected successfully to server at ${uri}`);
        _db = client.db('bikesDB');
        _coll = _db.collection('bikes');

    } catch (error) {
      console.error(error);
    }
}

export async function closeConnection() {
    await client.close();
}

export async function dropColl() {
    await _coll.drop();
}

export async function addBike(bike) {
    return await _coll.insertOne(bike);
}

export async function printData() {
    await _coll.find().forEach(console.dir);
}
