/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/mudjeans');
const adresseparis = require('./sources/adresseparis');

async function scrape(){
    try {
        const scrappers = [dedicatedbrand, mudjeans, adresseparis];
        const promises = scrappers.map(scrapper => scrapper.scrape());
        const all_brands = await Promise.all(promises);
        const all_pages = await Promise.all(all_brands.flat());
        let products = [];
        all_pages.forEach((page) => products.push(page.products));
        products = products.flat();

    console.log(`Retrieved ${products.length} products`);
    return products.sort(() => Math.random() - 0.5);
  } catch (e) {
    console.error(e);
  }
}

module.exports = scrape;
