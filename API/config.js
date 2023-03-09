import { config } from 'dotenv';

config();
export const serverPort = 3000;
export const sessionSecret = process.env.SESSION_SECRET;

export const rate = {
    windowMs: 5 * 60 * 1000,
    max: 100
};

/*
export const proxies = {
    '/': {
        protection: false,
        target: 'https://www.google.com',
        changeOrigin: true,
        pathRewrite: {
        [`^/`]: ''
        }
    },
    '/search': {
        protection: true,
        target: 'http://api.duckduckgo.com/',
        changeOrigin: true,
        pathRewrite: {
        [`^/search`]: ''
        }
    }
};
*/