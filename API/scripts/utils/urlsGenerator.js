import { doFetchPage } from "./fetches.js";

export function generateUrlPages(maxPage, urlBikester){
    return new Promise((resolve, reject) => {
        try {

            let arrayUrlPages = [];
            arrayUrlPages.push(urlBikester);
            for(let i=2; i<=maxPage; i++){
                arrayUrlPages.push(urlBikester + '?page=' + i + '&sz=48');
            };

            resolve(arrayUrlPages);
        } catch(e){
            reject(e);
        };
    });
}

export function getUrlFromPage(arrayUrlPages){
    return new Promise(async (resolve, reject) => {
        try {
            let i=1
            let arrayUrl = [];
            for (let url of arrayUrlPages){
                process.stdout.write('parsing page: ' + i + '/' + arrayUrlPages.length + '\r');
                const urlOnPage = await doFetchPage(url);
                arrayUrl = arrayUrl.concat(urlOnPage);
                i++;
            };
            resolve(arrayUrl);
        } catch(e){
            reject(e);
        };
    });
}