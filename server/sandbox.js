/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/mudjeans');
const adresseparis = require('./sources/adresseparis');

async function sandbox (brand='dedicated', eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const brandselector = {
        'dedicated': dedicatedbrand,
        'mud': mudjeans,
        'adresse': adresseparis
    };

    const scrapper = brandselector[brand];

    const products = await scrapper.scrape();
    console.log("Prout");

    console.log(products.flat());
    console.log(products.length);

    Promise.all(products).then(res => console.log());
    console.log('done');
  } catch (e) {
    console.error(e);
  }
}

const [,, brand, eshop] = process.argv;
console.log(brand);
console.log(eshop);

sandbox(brand, eshop);
