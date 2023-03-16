import express from 'express';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import { rateLimit } from 'express-rate-limit';
import { transports, format }  from 'winston';
import { logger } from 'express-winston';
import responseTime from 'response-time';
import cors from 'cors';
import helmet from 'helmet';
import bodyparser from 'body-parser';
import * as config from './config/config.js';

import { publicRouter } from './routes/publicInteraction.js';
import { reservedRouter } from './routes/reservedInteraction.js';

import { crawler } from './scripts/crawler.js';


const app = express();
const port = config.serverPort;
const secret = config.sessionSecret;
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/',
    collection: 'sessions'
})

const intervalId = setInterval(crawler, 1000*60*60*24*7); // 1s * 1m * 1h * 1d (now 7 days)

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

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            secure: false,
            httpOnly: false
        }
    })
);

app.use('/', reservedRouter);
app.use('/api', publicRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});