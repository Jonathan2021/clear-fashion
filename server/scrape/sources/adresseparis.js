const axios = require('axios');
const {'v5': uuidv5} = require('uuid');
const cheerio = require('cheerio');
const helper = require('../helper.js');
const domain = "adresse.paris";
const protocol = "https://";
const brand = "Adresse Paris"

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse_page = (data, link) => {
    console.log(`PARSING PAGE ${link}`);
    const $ = cheerio.load(data);

    return {'link': link, 'products': $('.product_list .product-container:has(.left-block)')
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
            const photo = $(element)
                .find('.product_img_link img')
                .attr('data-original');

            const link = $(element)
                .find('.product-name')
                .attr('href');

            const id = uuidv5(link, uuidv5.URL);

            return {'_id': id, name, price, photo, link, brand: brand};
        })
        .get()};
};

const parse_website = async (data, dom = domain, prot = protocol) =>
{
    const $ = cheerio.load(data);
    console.log(`PARSING WEBSITE ${domain}`);
    link = "https://adresse.paris/630-toute-la-collection"
    return [helper.get_url_data(link)
        .then(data => parse_page(data, link))];
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async (dom = domain, prot = protocol) => {
    console.log(domain);
    return helper.get_url_data(prot.concat(dom))
    .then(async data => {
        return (data != null) ? parse_website(data): null;
    })
};
