/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/mudjeans');
const adresseparis = require('./sources/adresseparis');

async function scrap {
    try {
        scrappers = [dedicatedbrand, mudjeans, adresseparis];
        all_brands = scrappers.map(scrapper => scrapper.scrape();
    const scrapper = brandselector[brand];

    const products = await scrapper.scrape();
    console.log("Prout");

    console.log(products.flat());
    console.log(products.length);

    Promise.all(products).then(res => 
    res.forEach(function (link, products) {
        console.log(link);
        console.log(products);
    }
    )
    );
    console.log('done');
  } catch (e) {
    console.error(e);
  }
}

const [,, brand, eshop] = process.argv;
console.log(brand);
console.log(eshop);

sandbox(brand, eshop);
