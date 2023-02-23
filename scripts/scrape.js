const cheerio = require('cheerio');

const urlBikester = 'https://www.bikester.it/biciclette/bici-elettriche/';
const urlProducts = 'https://www.bikester.it';

let arrayUrl = [];
let maxPage;
let maxProduct;

fetch(urlBikester)
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        console.log('fetch successfull - cheerio parsing...');
        const txt = cheerio.load(text);
        maxPage = getMaxPage(txt);
        maxProduct = getMaxProduct(txt);
        console.log('number of products found on page: ' + maxProduct);
        console.log(`pages to parse: ${maxPage}`);
        constructArrayUrl(txt);
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

// creates array of product urls 
function constructArrayUrl(){
    let arrayUrlPages = [];
    arrayUrlPages.push(urlBikester);
    for(let i=2; i<=maxPage; i++){
        arrayUrlPages.push(urlBikester + '?page=' + i + '&sz=48');
    };
    let fetches = [];
    arrayUrlPages.forEach(function(url, i, array){
        fetches.push(
        fetch(url)
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                console.log('parsing page ' + (i+1));
                parseTxt(cheerio.load(text));
            })
            .catch(function(err) {  
                console.log(err);
            })
        );
    });
    // wait for all fetches to complete before proceeding
    Promise.all(fetches).then(function(){
        console.log('\nfound ' + arrayUrl.length + ' products to scrape\nscraping phase initiating...');
        getData();
    })
}

// gets urls of single products in pages
function parseTxt($){
    const products = $('.product-tile-inner').children('.is-relative').children('a');
    const p = products.map((i, x) => $(x).attr('href')).toArray();
    arrayUrl.push.apply(arrayUrl, p);
}

function getData() {
    let fetches = [];
    //arrayUrl.forEach(function(url, i, array){
    //    fetches.push(
        fetch('https://www.bikester.it/ortler-bozen-trapeze-M1051259.html?vgid=G1550450#cgid=38448')//urlProducts + url
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                parserData(cheerio.load(text));
            })
            .catch(function(err) {  
                console.log(err);
            })
        //);
    //});
}

parserData($){
    //const price = $()
    //const tab = 
}