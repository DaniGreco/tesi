import express from "express";

export const reservedRouter = express.Router();

const protect = (req, res, next) => {
    const { authenticated } = req.session;

    if (!authenticated) {
        res.sendStatus(401);
    } else {
        next();
    }
};

reservedRouter.get('/login', (req, res) => {
    const { authenticated } = req.session;

    if (!authenticated) {
        req.session.authenticated = true;
        res.send('Successfully authenticated');
    } else {
        res.send('Already authenticated');
    }
});

reservedRouter.get("/logout", protect, (req, res) => {
    req.session.destroy(() => {
        res.send("Successfully logged out");
    });
});