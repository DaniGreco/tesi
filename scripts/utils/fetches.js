import { parsePage, parseBike } from "./parser.js";
import { load } from "cheerio";

export function doFetchPage(url){
    return new Promise((resolve, reject) => {
        try {
            fetch(url)
                .then(function(response) {
                    return response.text();
                })
                .then(async function(page) {
                    resolve(await parsePage(load(page)));
                })
                .catch(function(err) {
                    console.log(err);
                });
        } catch(e){
            reject(e);
        };
    });
}

export function doFetchBike(url, urlProducts){
    return new Promise((resolve, reject) => {
        try {
            fetch(urlProducts + url)
                .then(function(response) {
                    return response.text();
                })
                .then(async function(text) {
                    const bike = await parseBike(load(text));
                    resolve(bike);
                })
                .catch(function(err) {  
                    console.log(err);
                });
        } catch(e){
            reject(e);
        };
    });
}