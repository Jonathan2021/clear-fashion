require('dotenv').config({path: './.env'});
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = process.env.MONGODB_URI;

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }


    console.log(process.env.MONGO_PASSWORD);
    const MONGODB_URI = `mongodb+srv://dbUser:${process.env.MONGO_PASSWORD}@cluster0.lmfiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true });
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};

// Queries
module.exports.getProductById = async (id)=>{
    const db = await getDB();
    const collection = db.collection('products');
    const res = await collection.find({_id:id}).toArray();
    return res
}

module.exports.getFilteredProduct = async (limit, brand, price)=>{
    limit = limit<0?0:limit;
    const db = await getDB();
    const selector = Object.assign( {}, brand, price);
    const collection = db.collection('products');
    const n = await collection.countDocuments(selector);
    const res = await collection.find(selector).limit(limit).toArray();
    return {res, n}
}

module.exports.getBrands = async () =>{
    const db = await getDB();
    const collection = db.collection('products');
    const brands = await collection.distinct('brand');
    return brands;
}

// some other queries
/***
const getbrandProduct = async (brand)=>{
    const db = await getDB();
    const collection = db.collection('products');
    const res = await collection.find({brand:brand}).toArray();;
    return res
}
const lessThanPrice = async (price)=>{
    const db = await getDB();
    const collection = db.collection('products');
    const res = await collection.find({"price":{$lte:price}}).toArray();;
    return res
}
const sortedByprice = async ()=>{
    const db = await getDB();
    const collection = db.collection('products');
    const res = await collection.find().sort({"price":-1}).toArray();;
    return res
}
***/
