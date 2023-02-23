const cheerio = require('cheerio');
const fs = require('fs');

const urlBikester = 'https://www.bikester.it/biciclette/bici-elettriche/'
let arrayUrl = [];
let maxPage;

fetch(urlBikester)
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        console.log('fetch successfull - cheerio parsing...');
        const txt = cheerio.load(text);
        maxPage = getMaxPage(txt);
        console.log(`pages to parse: ${maxPage}`);
        constructArrayUrl(txt);
    })
    .catch(function(err) {  
        console.log(err);  
    });

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

function constructArrayUrl($){
    let arrayUrlPages = [];
    arrayUrlPages.push(urlBikester);
    for(let i=2; i<=maxPage; i++){
        arrayUrlPages.push(urlBikester + '?page=' + i + '&sz=48');
    };
    arrayUrlPages.forEach(function(url, i){
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
            });
    })
}

function parseTxt($){
    const products = $('.product-tile-inner').children('.is-relative').children('a');
    const p = products.map((i, x) => $(x).attr('href')).toArray();
    arrayUrl.push.apply(arrayUrl, p);
}