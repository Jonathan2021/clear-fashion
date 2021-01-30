// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

const allBrandsOption = "all";
const checkedNewRelease = false;
const checkedPrice = false;

const sortings = {
    'price-asc' : {'func': sort_by_ascending_price, 'repr': "Cheap"},
    'price-desc' : {'func':sort_by_descending(x => x.price), 'repr': "Expensive"},
    'date-desc' : {'func': sort_by_descending(x => new Date(x.released)), 'repr': "Recent released"},
    'date-asc': {'func': sort_by_ascending(x => new Date(x.released)), 'repr': "Old release"}
};
const defaultSortOption = "price-asc";

const noChange = (array) => array;

// current products on the page
let currentProducts = [];
let currentPagination = {};
let allBrands = [];
let filters = {
    'brand' : {'currentChange' : noChange, 'currentValue' : allBrandsOption, 'defaultChange' : noChange, 'defaultValue' : allBrandsOption},
    'price' : { 'currentChange' : noChange, 'currentValue' : checkedPrice, 'defaultChange' : noChange, 'defaultValue' : checkedPrice},
    'new_release' : { 'currentChange' : noChange, 'currentValue' : checkedNewRelease, 'defaultChange' : noChange, 'defaultValue' : checkedNewRelease},
    'sort' : { 'currentChange' : sortings[defaultSortOption].func, 'currentValue' : defaultSortOption, 'defaultChange' : sortings[defaultSortOption].func, 'defaultValue' : defaultSortOption},
};


// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const checkNewReleases = document.querySelector('#new-release-check');
const checkPrice = document.querySelector('#price-check');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectSorting = document.querySelector('#sort-select');

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
 * Apply all filters to array
 */
const apply_filters = ([...array], all_filters = filters, get_filter = x => x.currentChange) => {
    for (const filter of Object.values(all_filters))
    {
        array = get_filter(filter)(array);
    }
    return array;
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

const fetchBrands = async () => {
    try
    {
        const response = await fetch(
            `https://clear-fashion-api.vercel.app/brands`
        );
        
        const body = await response.json();

        if (body.success !== true) {
            console.error(body);
            return brands;
        }

        return body.data.result;


    }
    catch (error) {
        console.error(error);
        return brands;
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
const renderBrands = (brands = allBrands, value = filters.brand.currentValue) => {
    brands.sort();
    const choices = brands
        .map(brand =>
            `<option value="${brand}">${brand}</option>`
        )
        .join('\n');
    selectBrand.innerHTML = [`<option value="${filters.brand.defaultValue}">${filters.brand.defaultValue}</option>`, choices].join('\n');
    selectBrand.value = value;
};

/*
 * Render Sorting selector
 */

const renderSorting = (value = defaultSortOption) => {
    selectSorting.innerHTML = Object.entries(sortings)
        .map(([value, {repr}]) =>
            `<option value="${value}">${repr}</option>`
        )
        .join('\n');
    selectSorting.value = value;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
    const {count} = pagination;

    spanNbProducts.innerHTML = count;
};

const render = (products = currentProducts, pagination = currentPagination) => {
    //console.log(filters);
    //console.log(filter_on_brand(x => x == "adresse")(currentProducts));
    //renderBrands();
    renderProducts(apply_filters(products));
    renderPagination(pagination);
    renderIndicators(pagination);
    console.log(apply_filters(products));
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
        .then(render);
});

/**
 * Select the page to display
 * @type {[type]}
 */
selectPage.addEventListener('change', event => {
    fetchProducts(parseInt(event.target.value), currentPagination.pageSize)
        .then(setCurrentProducts)
        .then(render);
});

/**
 * Filter by brand
 * 
 */
selectBrand.addEventListener('change', event => {
    //console.log(event.target.value);
    if (event.target.value !== filters.brand.defaultValue)
    {
        filters.brand.currentValue = event.target.value;
        filters.brand.currentChange = filter_on_brand(x => x === filters.brand.currentValue);
    }
    else
    {
        filters.brand.currentChange = filters.brand.defaultChange;
        filters.brand.currentValue = filters.brand.defaultValue;
    }
    render();
});

/**
 * Filter new release
 */
checkNewReleases.addEventListener('change', event => {
    filters.new_release.currentValue = checkNewReleases.checked;
    if (checkNewReleases.checked)
    {
        filters.new_release.currentChange = filter_release_2_weeks;
    }
    else
    {
        filters.new_release.currentChange =  filters.new_release.defaultChange;
    }
    render();
});

/**
 * Filter price
 */
checkPrice.addEventListener('change', event => {
    filters.price.currentValue = checkPrice.checked;
    if (checkPrice.checked)
    {
        filters.price.currentChange = filter_price_range(0)(50);
    }
    else
    {
        filters.price.currentChange =  filters.price.defaultChange;
    }
    render();
});

/**
 *
 */
selectSorting.addEventListener('change', event => {
    filters.sort.currentValue = event.target.value;
    filters.sort.currentChange = sortings[event.target.value].func;
    render();
});

/**
 * Filter by brand name
 */

document.addEventListener('DOMContentLoaded', () =>
{
    fetchBrands().then(brands => allBrands = brands).then(renderBrands);
    fetchProducts()
    .then(setCurrentProducts)
    .then(render);
    renderSorting();
});
