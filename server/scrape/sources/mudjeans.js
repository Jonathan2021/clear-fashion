const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
const helper = require('../helper.js');
const domain = "mudjeans.eu";
const protocol = "https://";
const brand = "Mud Jeans"

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse_page = (data, link) => {
    console.log(`PARSING PAGE ${link}`);
    const $ = cheerio.load(data);

    return {'link': link, 'products' : $('.collection-products .product-link')
        .map((i, element) => {
            const name = $(element)
                .find('.product-title')
                .text()
                .trim()
                .replace(/\s/g, ' ');
            const price = parseFloat( 
                $(element)
                .find('.product-price')
                .first()
                .text()
                .replace(/\s|(Buy)|€/g, '')
                .replace(/,/g, '.')
            );
            const link = $(element)
                .find('a')
                .attr('href');
            
            const photo = 'https://'+$(element)
                .find('picture')
                .find('source')
                .attr('srcset')
                .split(',').pop().slice(2, -3);


            const id = uuidv5(link, uuidv5.URL);

            return {'_id': id, name, price, photo, link, brand};
        })
        .get()};
};

const parse_website = async (data, dom = domain, prot = protocol) =>
{
    const $ = cheerio.load(data);
    console.log(`PARSING WEBSITE ${domain}`);

    return $('.header-navigation--primary a.level-1')
        .map((i, element) => {
            const link = $(element)
                .attr('href');

            full_url = prot.concat(dom).concat(link);

            return helper.get_url_data(full_url).then(data => parse_page(data, link));
        })
        .get().flat();
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
