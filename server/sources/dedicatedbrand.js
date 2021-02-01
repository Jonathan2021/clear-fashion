const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
    const $ = cheerio.load(data);

    return $('.productList-container .productList')
        .map((i, element) => {
            const name = $(element)
                .find('.productList-title')
                .text()
                .trim()
                .replace(/\s/g, ' ');

            const price = parseFloat(
                $(element)
                .find('.productList-price')
                .text()
            );

            const link = $(element)
            .find('.productList-link')
            .attr('href');

            const photo = $(element)
            .find('.productList-image img')
            .first()
            .attr('src');

            return {name, price, link, photo, brand: "dedicated"};
        })
        .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
    const response = await axios(url);
    const {data, status} = response;

    if (status >= 200 && status < 300) {
        return parse(data);
    }

    console.error(status);

    return null;
};