// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

const allBrandsOption = "all";

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = allBrandsOption;

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
    currentProducts = result;
    currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
    try {
        const response = await fetch(
            `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
        );
        const body = await response.json();

        if (body.success !== true) {
            console.error(body);
            return {currentProducts, currentPagination};
        }

        return body.data;
    } catch (error) {
        console.error(error);
        return {currentProducts, currentPagination};
    }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    const template = products
        .map(product => {
            return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
        })
        .join('');

    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
    const {currentPage, pageCount} = pagination;
    const options = Array.from(
        {'length': pageCount},
        (value, index) => `<option value="${index + 1}">${index + 1}</option>`
    ).join('');

    selectPage.innerHTML = options;
    selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render Brand selector
 * @param [brands]
 */
const renderBrands = (brands, value) => {
    brands.sort();
    const choices = brands
        .map(brand =>
            `<option value="${brand}">${brand}</option>`
        )
        .join('\n');
    selectBrand.innerHTML = [`<option value="${allBrandsOption}">${allBrandsOption}</option>`, choices].join('\n');
    selectBrand.value = value;
}


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
    const {count} = pagination;

    spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
    renderBrands(get_brands(currentProducts), currentBrand);
    renderProducts(products);
    renderPagination(pagination);
    renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
    fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
});

/**
 * Select the page to display
 * @type {[type]}
 */
selectPage.addEventListener('change', event => {
    fetchProducts(parseInt(event.target), currentPagination.pageSize)
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
});

/**
 * Filter by brand
 * 
 */
selectBrand.addEventListener('change', event => { 
    console.log(event.target);
    const products = (event.target.value !== allBrandsOption) ?
        filter_on_brand(x => x === event.target.value)(currentProducts)
        : currentProducts;
    currentBrand = event.target.value;
    render(products, currentPagination);
});

/**
 * Filter by brand name
 */

document.addEventListener('DOMContentLoaded', () =>
    fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);
