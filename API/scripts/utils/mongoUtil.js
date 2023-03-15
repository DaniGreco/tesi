// CONNECT SERVER TO DATABASE
import { MongoClient } from 'mongodb';
//const user = encodeURIComponent('root');
//const pass = encodeURIComponent('12345');
//const authMechanism = "DEFAULT";

const url = 'localhost:27017';
const uri = `mongodb://${url}`;
let client;
export let _db;
export let _coll;

export async function establishConnection() {
    return new Promise (async (resolve, reject) => {
        try {
            // creating client that connects to db
            client = new MongoClient(uri);
            // connect client to server
            await client.connect();
            // establish and verify connection
            await client.db('admin').command({ ping: 1 });

            console.log(`Connected successfully to server at ${uri}`);
            _db = client.db('bikesDB');
            _coll = _db.collection('bikes');
            resolve(client);
        } catch (error) {
            reject(error);
        }
    })
}

export async function backup() {
    return new Promise (async (resolve, reject) => {
        try {
            const _backup = _db.collection('backup');
            await _backup.drop();
            const docs = _coll.find()
            for await (const doc of docs) { _db.collection('backup').insertOne(doc) }
            resolve('Backup DONE');
        } catch (error) {
            reject(error)
        }
    })
}

export async function dropColl() {
    return new Promise (async (resolve, reject) => {
        try {
            await _coll.drop();
            _coll = _db.collection('bikes')
            resolve('emptying old collection DONE');
        } catch (error) {
            reject(error)
        }
    })
}

export async function addBike(bike) {
    return await _coll.insertOne(bike);
}

export async function printData() {
    await _coll.find().forEach(console.dir);
}
