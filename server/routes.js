const express = require('express');
const router = express.Router(); 
const bdd = require('./db');


router.get('/products/search', async (req, res)=>{

    let brand = req.query.brand?{brand:req.query.brand}:{}
    let categorie = req.query.categorie?{categorie:req.query.categorie}:{}
    let limit = parseInt(req.query.limit)?parseInt(req.query.limit):12
    let price = parseFloat(req.query.price)?{price:parseFloat(req.query.price)}:{}

    let result = await bdd.getFilteredProduct(limit, brand, price, categorie)

    res.send({
        limit,
        brand:brand.brand,
        price:price.price,
        TotalNumberOfProducts:result.n,
        results:result.res
    })
})



router.get('/products/:id',  async (req, res)=>{
    res.send(await bdd.getProductById(req.params.id))

})

router.get('/brands', async (req, res) => {
    res.send(await bdd.getBrands());
})


module.exports = router; 
