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

    const products = await scrapper.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, brand, eshop] = process.argv;
console.log(brand);
console.log(eshop);

sandbox(brand, eshop);
