import { load } from 'cheerio';
import { getMaxPage, getMaxProduct } from './utils/getMax.js';
import { generateUrlPages, getUrlFromPage } from './utils/urlsGenerator.js';
import { doFetchBike } from './utils/fetches.js';
import { addBike, establishConnection, backup, dropColl } from './utils/mongoUtil.js';

export async function crawler() {

    const urlBikester = 'https://www.bikester.it/biciclette/bici-elettriche/';
    const urlProducts = 'https://www.bikester.it';

    let maxPage;
    let maxProduct;
    let counterBike = 0;

    const client = await establishConnection();

    const returnBackup = await backup();
    console.log(returnBackup);

    await dropColl();
    

    fetch(urlBikester)

        .then(function(response) {
            return response.text();
        })

        .then(async function(text) {
            console.log('fetch successfull - cheerio parsing...');
            const txt = load(text);
            maxPage = await getMaxPage(txt);
            maxProduct = await getMaxProduct(txt);
            console.log(`number of products found on first page: ${maxProduct}`);
            return txt;
        })

        .then(async function() {
            return await generateUrlPages(maxPage, urlBikester);
        })

        .then(arrayUrlPages => {
            return new Promise(async (resolve, reject) => {
                try {
                    const arrayUrl = await getUrlFromPage(arrayUrlPages);
                    resolve(arrayUrl);
                } catch(e){
                    reject(e);
                };
            });
        })

        .then(async function(arrayUrl) {
            console.log(`\nfound ${arrayUrl.length} products to scrape\nscraping phase initiating...`);
            for await (let url of arrayUrl){
                counterBike++;
                process.stdout.write(`parsing bike: ${counterBike}/${arrayUrl.length}\r`);
                const bike = await doFetchBike(url, urlProducts);
                addBike(bike).then(res => {
                    if (res.acknowledged == false){
                        console.log('\nsomething went wrong\n');
                    }
                });
            }
            process.stdout.write('\nDONE\n')
            return true;
        })

        .catch(function(err) {
            console.log(err);
        });
}