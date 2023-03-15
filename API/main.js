import express from 'express';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit';
import { transports, format }  from 'winston';
import { logger } from 'express-winston';
import responseTime from 'response-time';
import cors from 'cors';
import helmet from 'helmet';
import * as config from './config/config.js';

import { publicRouter } from './routes/publicInteraction.js';
import { reservedRouter } from './routes/reservedInteraction.js';

import { crawler } from './scripts/crawler.js';

const app = express();
const port = config.serverPort;
const secret = config.sessionSecret;
const store = new session.MemoryStore();

const intervalId = setInterval(crawler, 1000*60*20); // 1s * 1m * 1h * 1d

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
        secret: secret,
        resave: false,
        saveUninitialized: true,
        store,
    })
);

app.use('/', reservedRouter);
app.use('/api', publicRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});