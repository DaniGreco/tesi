import express from "express";
import { MongoClient } from 'mongodb';
const urlDB = 'localhost:27017';
const uriDB = `mongodb://${urlDB}`;
const client = new MongoClient(uriDB);
let coll;
let db;

async function establishConnection() {
    try {

        // connect client to server
        await client.connect();
        // establish and verify connection
        await client.db('admin').command({ ping: 1 });
        console.log(`Connected successfully to server at ${uriDB}\n`);
    
        db = client.db('bikesDB');
        coll = db.collection("bikes");

    } catch (error) {
        console.error(error);
}};

establishConnection().catch(console.dir);



const alwaysAllow = (_1, _2, next) => {
    next();
};

export const publicRouter = express.Router();

function dbInterface(query, group) {
    return new Promise(async (resolve, reject) => {
        try {  
            const { min = 'min', max = 'max' } = query;
            let resJson = {};
            const aggr = [
                { $match: { current_price: { $gt:+min , $lt:+max } } },
                { $group: group }
            ]
            const result = await coll.aggregate(aggr).sort({_id:1});
            for await (const doc of result) {
                resJson[doc._id] = doc.data;
            }
            resolve(resJson);
        } catch (error) {
            reject(error);
        }
    })
}

publicRouter.get('/pricerange', alwaysAllow, async (req, res) => {
    const resultMax = await coll.find().sort({"current_price":-1}).limit(1).toArray();
    const max = resultMax[0].current_price;
    const resultMin = await coll.find().sort({"current_price":1}).limit(1).toArray();
    const min = resultMin[0].current_price;
    res.send({minPrice: min, maxPrice: max});
});

publicRouter.get('/year', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.anno_modello', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);
    res.setHeader('Content-Type', 'application/json')
    res.send(resJson);
});

publicRouter.get('/usecase', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.utilizzo', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);

    let keys = Object.keys(resJson);
    let aggrKeys = [];
    for await (const str of keys) {
        const val = str.split(',')[0];
        aggrKeys.push(val);
    }

    let arr = [... new Set(aggrKeys)];
    arr = arr.sort((a, b) => {return a-b});
    let aggrObj = {};
    
    for await (const key of arr) {aggrObj[key] = 0}
    for await (const key of keys) {
        const i = key.split(',')[0];
        aggrObj[i] = aggrObj[i] + resJson[key];
    }

    res.setHeader('Content-Type', 'application/json')
    res.send(aggrObj);
});

publicRouter.get('/autonomy', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.autonomia.autonomia_km', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);

    let keys = Object.keys(resJson);
    let aggrKeys = [];
    for await (const str of keys) {
        const val = str.split('-')[0];
        aggrKeys.push(val);
    }

    let arr = [... new Set(aggrKeys)];
    arr = arr.sort((a, b) => {return a-b});
    let aggrObj = {};
    
    for await (const key of arr) {aggrObj[key] = 0}
    for await (const key of keys) {
        const i = key.split('-')[0];
        aggrObj[i] = aggrObj[i] + resJson[key];
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(aggrObj);
});

publicRouter.get('/batterycap', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.batteria.contenuto_energetico', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);

    let newJson = {};
    let keys = Object.keys(resJson);
    for await (const str of keys) {
        const val = str.split(' ')[0];
        newJson[val] = resJson[str];
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.send(newJson);
});

publicRouter.get('/batterybrand', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.batteria.modello', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);
    
    let newJson = {};
    let keys = Object.keys(resJson);
    for await (const str of keys) {
        const val = str.split(' ')[0];
        newJson[val] = resJson[str];
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.send(newJson);
});

publicRouter.get('/motorperf', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.motore.rendimento', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);
    
    let newJson = {};
    let keys = Object.keys(resJson);
    for await (const str of keys) {
        const val = str.split(' ')[0];
        newJson[val] = resJson[str];
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.send(newJson);
});

publicRouter.get('/motorbrand', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.motore.marchio', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);
    
    res.setHeader('Content-Type', 'application/json')
    res.send(resJson);
});

publicRouter.get('/motorpos', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.motore.tipo', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);
    
    res.setHeader('Content-Type', 'application/json')
    res.send(resJson);
});

publicRouter.get('/weight', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.dimensioni.peso_circa', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);
    
    let newJson = {};
    let keys = Object.keys(resJson);
    for await (const str of keys) {
        const val = str.split(' ')[0];
        newJson[val] = resJson[str];
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.send(newJson);
});

publicRouter.get('/maxweight', alwaysAllow, async (req, res) => {
    const jsonAggr = { _id:'$data.dimensioni.peso_massimo_consentito', data: { $sum: 1 } };
    const resJson = await dbInterface(req.query, jsonAggr);
    
    let newJson = {};
    let keys = Object.keys(resJson);
    for await (const str of keys) {
        const val = str.split(' ')[0];
        newJson[val] = resJson[str];
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.send(newJson);
});

