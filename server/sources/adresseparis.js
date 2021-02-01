const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
    const $ = cheerio.load(data);

    return $('.product_list .product-container')
        .map((i, element) => {
            const name = $(element)
                .find('.product-name')
                .attr("title")
                .trim()
                .replace(/\s/g, ' ');
            const price = parseFloat(
                $(element)
                .find('.product-price')
                .text()
                .replace(/€/g, '')
                .replace(/,/g, '.')
            );

            const link = $(element)
                .find('.product-name')
                .attr('href');

            return {name, price, link, brand: "adresse"};
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
