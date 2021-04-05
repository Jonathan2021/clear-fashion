const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
const helper = require('../helper.js');
const domain = "www.dedicatedbrand.com";
const protocol = "https://";
const brand = "Dedicated"

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse_page = (data, link) => {
    const $ = cheerio.load(data);
    console.log(`PARSING PAGE ${link}`);

    return {'link': link, 'products': $('.productList-container .productList')
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
            
            const id = uuidv5(link, uuidv5.URL);

            return {'_id': id, name, price, photo, link, brand, 'released': helper.currentDate()};
        })
        .get()};
};

const parse_website = async (data, dom = domain, prot = protocol) =>
{
    const $ = cheerio.load(data);
    console.log(`PARSING WEBSITE ${domain}`);

    return $('.mainNavigation-link-subMenu-link')
        .map((i, element) => {
            const link = $(element)
                .find('a')
                .attr('href');

            full_url = prot.concat(dom).concat(link);

            return helper.get_url_data(full_url).then(data => parse_page(data, link));
        })
        .get().flat();
};

module.exports.scrape = async (dom = domain, prot = protocol) => {
    console.log(domain);
    return helper.get_url_data(prot.concat(dom))
    .then(async data => {
        return (data != null) ? parse_website(data): null;
    })
};
