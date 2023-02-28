export function getMaxPage($){
    return new Promise((resolve, reject) => {
        try {
            const products = $('.pagination__listitem').children('a');
            const p = products.map((i, x) => $(x).text()).toArray();
            let num = [];
            p.forEach(element => {
                element = element.replace(/\n/g, '');
                if(isNaN(element) == false) {
                    num.push(+element);
                }
            });
            resolve(Math.max.apply(null, num));
        } catch(e){
            reject(e);
        };
    });
}

// gets number of products
export function getMaxProduct($){
    return new Promise((resolve, reject) => {
        try {
            const num = $('.scroll-pivot').children('.cyc-flex.cyc-flex--end.cyc-flex--wrap.cyc-margin_bottom-5.contentwrapper').children('span');
            const n = +num.attr('data-value');
            resolve(n);
        } catch(e){
            reject(e);
        };
    });
}
