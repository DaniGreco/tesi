const cheerio = require('cheerio');

const urlBikester = 'https://www.bikester.it/biciclette/bici-elettriche/';
const urlProducts = 'https://www.bikester.it';

let arrayUrl = [];
let maxPage;
let maxProduct;
let counterBike = 0;

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);


fetch(urlBikester, { signal: controller.signal })
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        console.log('fetch successfull - cheerio parsing...');
        const txt = cheerio.load(text);
        maxPage = getMaxPage(txt);
        maxProduct = getMaxProduct(txt);
        console.log('number of products found on first page: ' + maxProduct);
        console.log(`pages to parse: ${maxPage}`);
        return txt;
    })
    .then(function() {
        return getArraySeparated();
    })
    .then(arraySeparated => {
        return new Promise((resolve, reject) => {
            try {
                const partitions = async (arraySeparated) => {
                    i = 1
                    for (let urlPartition of arraySeparated){
                        console.log('\nblock: ' + i++);
                        await getFromPartition(urlPartition);
                    };
                    resolve(arrayUrl);
                };
                partitions(arraySeparated).catch(console.error);
            } catch(e){
                reject(e);
            };
        });
    })
    .then(arrayUrl => {
        console.log('\nfound ' + arrayUrl.length + ' products to scrape\nscraping phase initiating...');
        console.log('AYOOOOO');
    })
    .catch(function(err) {
        console.log(err);
    });

// gets the number of pages where there are products
function getMaxPage($){
    const products = $('.pagination__listitem').children('a');
    const p = products.map((i, x) => $(x).text()).toArray();
    let num = [];
    p.forEach(element => {
        element = element.replace(/\n/g, '');
        if(isNaN(element) == false) {
            num.push(+element);
        }
    });
    return Math.max.apply(null, num);
}

// gets number of products
function getMaxProduct($){
    const num = $('.scroll-pivot').children('.cyc-flex.cyc-flex--end.cyc-flex--wrap.cyc-margin_bottom-5.contentwrapper').children('span');
    const n = +num.attr('data-value');
    return n;
}

// separates urls into blocks of buffer size to ease the load on the receiver server 
function getArraySeparated(){
    return new Promise((resolve, reject) => {
        try {

            let arrayUrlPages = [];
            arrayUrlPages.push(urlBikester);
            for(let i=2; i<=maxPage; i++){
                arrayUrlPages.push(urlBikester + '?page=' + i + '&sz=48');
            };

            const buffer = 5;
            let n = 0;
            let arraySeparated = [];
            let partition = [];

            for(i=0; i<arrayUrlPages.length; i++){
                if(n < buffer){
                    partition.push(arrayUrlPages[i]);
                    n = n+1;
                } else {
                    arraySeparated.push(partition);
                    partition = [arrayUrlPages[i]];
                    n = 1;
                };

                if(i == arrayUrlPages.length-1) {
                    arraySeparated.push(partition);
                };
            };

            resolve(arraySeparated);
        } catch(e){
            reject(e);
        };
    });
}

function getFromPartition(urlPartition){
    return new Promise((resolve, reject) => {
        try {

            let fetches = [];

            //TRASFORMA IN PURO SINCRONO



            urlPartition.forEach(function(url, i, array){
                fetches.push(
                    fetch(url, { signal: controller.signal })
                        .then(function(response) {
                            return response.text();
                        })
                        .then(function(page) {
                            process.stdout.write('parsing page ' + (i+1) + '\033[0G');
                            return parsePage(cheerio.load(page));
                        })
                        .catch(function(err) {  
                            console.log(err);
                        })
                );
            });

            // wait for all fetches to complete before proceeding
            Promise.all(fetches).then(function(){
                process.stdout.write('parsing pages DONE\033[0G');
                resolve(arrayUrl);
            });

        } catch(e){
            reject(e);
        };
    });
}

// gets urls of single products in pages
function parsePage($){
    return new Promise((resolve, reject) => {
        try {
            const products = $('.product-tile-inner').children('.is-relative').children('a');
            const p = products.map((i, x) => $(x).attr('href')).toArray();
            arrayUrl.push.apply(arrayUrl, p);
            resolve(true);
        } catch(e){
            reject(e);
        };
    });
}

// starts fetching data from each bike's page
function getData() {
    let fetches = [];
    arrayUrl.forEach(function(url, i, array){
        fetches.push(
            fetch(urlProducts + url, { signal: controller.signal })
                .then(function(response) {
                    return response.text();
                })
                .then(function(text) {
                    counterBike = counterBike+1;
                    process.stdout.write('parsing bike: ' + counterBike + '\033[0G')
                    parserData(cheerio.load(text));
                })
                .catch(function(err) {  
                    console.log(err);
                })
            
        );
    });
}

function parserData($){

    //// scraping brand, model and id

    const nameDiv = $('.product-name-ctr');
    const array = nameDiv.children('h1').text().split('\n\n');
    const brand = array[1];
    const model = array[2].replace(/\n/g, '');
    const id = +nameDiv.find('span').text();

    //// scraping prices
    
    // not on sale 
    let currentPrice;
    $('.product-price-ctr span').each((i, el) => {
        if(el.attribs.itemprop == 'price'){
            currentPrice = +el.attribs.content;
        };
    });

    // on sale
    let retailPrice;
    let stringPrice = $('.product-price-ctr div.has-promo-price').find('.retail-price').first().text();
    if(!!stringPrice){
        const chars1 = {
            '\n':'',
            ' ':'',
            '.':'',
            '€':''
        };
        stringPrice = stringPrice.replace(/[\n .€]/g, str => chars1[str]);
        retailPrice = +stringPrice.split(',')[0];
    } else {
        retailPrice = currentPrice;
    }
    
    // creating object to insert in the collection
    let objBike = {
        id:id,
        brand:brand,
        model:model,
        current_price: currentPrice,
        retail_price: retailPrice,
        data:[]
    };

    //// scraping data
    $('.pdp_featurelist').children('.pdp_featureitem').each((i, el) => {
        const chars = {
            '\n':'',
            ' ':'_',
            '(':'',
            ')':''
        };
        // get the group name of the features
        const groupName = ($(el).children('.pdp_featurelist_group').text()).replace(/[\n ]/g, str => chars[str]);
        objBike.data[groupName] = [];
        
        //if there are no feature, just value then equal this to the group name
        if($(el).children('.pdp_featurelist_feature').length == 0) {
            objBike.data[groupName] = $(el).children('.pdp_featurelist_value').text();
        } // if there are features, for each feature save the respective value, if necessary modify the strings so the names of the features make sense in the json
        else {
            $(el).children('.pdp_featurelist_feature').each((j, el1) => {

                let featureText = $(el1).text();
                featureText = featureText.substring(0,featureText.length-2);
                featureText = featureText.replace(/[\n ()]/g, str => chars[str]);
                featureText = featureText.replace(/dell'/g, '');
    
                let valueText = $(el1).next().text();
                valueText = valueText.replace(/[\n]/g, str => chars[str]);
    
                objBike.data[groupName][featureText] = valueText;
            });
        };
    });

    //console.log(objBike);
}