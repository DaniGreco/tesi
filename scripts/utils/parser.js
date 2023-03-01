export function parsePage($){
    return new Promise((resolve, reject) => {
        try {
            let arrayUrlOnPage = [];
            const products = $('.product-tile-inner').children('.is-relative').children('a');
            const p = products.map((i, x) => $(x).attr('href')).toArray();
            arrayUrlOnPage.push.apply(arrayUrlOnPage, p);
            resolve(arrayUrlOnPage);
        } catch(e){
            reject(e);
        };
    });
}

export function parseBike($){
    return new Promise(async (resolve, reject) => {
        try {

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
                data:{}
            };

            //// scraping data
            objBike = await parseData($, objBike);
            resolve(objBike);
        } catch(e){
            reject(e);
        };
    });
}



function parseData($, objBike){
    return new Promise((resolve, reject) => {
        try {
            $('.pdp_featurelist').children('.pdp_featureitem').each((i, el) => {
                const chars = {
                    '\n':'',
                    ' ':'_',
                    '(':'',
                    ')':''
                };
                // get the group name of the features
                const groupName = ($(el).children('.pdp_featurelist_group').text()).replace(/[\n ]/g, str => chars[str]);
                objBike.data[groupName] = {};

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
            resolve(objBike);
        } catch(e){
            reject(e);
        };
    });
}