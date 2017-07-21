'use strict';

const companyRoutes = require('./routes/company'),
      exphbs  = require('express-handlebars'),
      bodyParser = require('body-parser'),
      express = require('express'),
      morgan = require('morgan');

const app = express();

require('./lib/db');            // setup connection

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api/company', companyRoutes);
//app.get('/', (req, res) => res.render('prerenderedHomePage'));

module.exports = app;
