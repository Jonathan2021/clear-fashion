const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');

const PORT = 8092;
const app = express();

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.use('/', routes)  

app.options('*', cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);


module.exports = app;