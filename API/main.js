import express from 'express';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit';
import { transports, format }  from 'winston';
import { logger } from 'express-winston';
import responseTime from 'response-time';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import * as config from './config.js';

import { MongoClient } from 'mongodb';
const urlDB = 'localhost:27017';
const uriDB = `mongodb://${urlDB}`;
const client = new MongoClient(uriDB);

async function establishConnection() {
try {
    // connect client to server
    await client.connect();
    // establish and verify connection
    await client.db('admin').command({ ping: 1 });
    console.log(`Connected successfully to server at ${uriDB}\n`);

    const db = client.db('bikesDB');
    const coll = db.collection("bikes");

    //await coll.drop();
    await db.admin().listDatabases().then(function (databases) { 
        //console.log(databases)
    });

    /*}finally {
    //close client when finish/error
    await client.close(); 
    }await coll.find({ brand: 'Bianchi' }).forEach(res =>{
        console.log(res.data.Attacco.Design);
    });*/
    
    
    //function(error, result) {
    //    if(err) throw err;
    //    console.log(result);
    //});
} catch (error) {
    console.error(error);
}};

const app = express();
const port = config.serverPort;
const secret = config.sessionSecret;
const store = new session.MemoryStore();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const alwaysAllow = (_1, _2, next) => {
    next();
};
const protect = (req, res, next) => {
    const { authenticated } = req.session;

    if (!authenticated) {
        res.sendStatus(401);
    } else {
        next();
    }
};

app.disable("x-powered-by");

app.use(helmet());

app.use(responseTime());

app.use(
    logger({
        transports: [new transports.Console()],
        format: format.json(),
        statusLevels: true,
        meta: false,
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        expressFormat: true,
        ignoreRoute() {
            return false;
        },
    })
);

app.use(cors());

app.use(rateLimit(config.rate));

app.use(
     session({
        secret,
        resave: false,
        saveUninitialized: true,
        store,
    })
);

app.use(express.static(path.join(__dirname, '././public')));

app.get('/login', (req, res) => {
    const { authenticated } = req.session;

    if (!authenticated) {
        req.session.authenticated = true;
        res.send('Successfully authenticated');
    } else {
        res.send('Already authenticated');
    }
});

app.get("/logout", protect, (req, res) => {
    req.session.destroy(() => {
        res.send("Successfully logged out");
    });
});

app.get('/', alwaysAllow, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/ui/index.html'));
});

establishConnection().catch(console.dir);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});