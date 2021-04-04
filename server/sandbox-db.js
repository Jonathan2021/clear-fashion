/* eslint-disable no-console, no-process-exit */
const scrape = require('./scrape');
const db = require('./db');

async function sandbox () {
  try {
    const products = await scrape();
    console.log(`👕 ${products.length} products found`);

    const result = await db.insert(products);

    console.log(`💽  ${result.insertedCount} inserted products`);

    console.log('\n');

    console.log('💽  Find Dedicated products only');

    const dedicatedOnly = await db.find({'brand': 'Dedicated'});

    console.log(`👕 ${dedicatedOnly.length} total of products found for dedicated`);
    //console.log(dedicatedOnly);

    db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();
