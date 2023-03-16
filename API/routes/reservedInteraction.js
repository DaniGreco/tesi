import express from "express";
import bcryptjs from 'bcryptjs';
import { establishConnection } from "../scripts/utils/mongoUtil.js";



const client = await establishConnection()
const _db = client.db('bikesDB');
const _coll = _db.collection('bikes');
const _collUsers = _db.collection('users');

export const reservedRouter = express.Router();

const protect = (req, res, next) => {
    const { authenticated } = req.session;
    console.log(req.session);
    if (!authenticated) {
        res.sendStatus(401);
    } else {
        next();
    }
};

reservedRouter.post('/login', async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    const { authenticated } = req.session;
    
    
    if (!authenticated) {

        const results = await _collUsers.findOne({ username: user.username });

        if (!results) { return res.status(404).send({ message: "User Not found or password Incorrect" }) }

        const passwordIsValid = bcryptjs.compareSync(
            user.password,
            results.password
        );
        
        if (!passwordIsValid) {
            return res.status(404).send({ message: "User Not found or password Incorrect" })
        }
        else {
            req.session.authenticated = true;
            res.status(200).send('Successfully authenticated: ' + req.session.authenticated);
        }
        
    } else {
        res.status(401).send('Already authenticated');
    }
});

reservedRouter.get("/download", async (req, res) => {
    try {
        const js = {};
        const iterable = _coll.find();
        let i = 0;
        for await (const doc of iterable) {
            js[i] = doc
            i++
        }
        res.status(200).send(js);
    } catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
});

reservedRouter.get("/logout", protect, (req, res) => {
    req.session.destroy(() => {
        res.send("Successfully logged out");
    });
});