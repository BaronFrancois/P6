const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors')
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000

app.listen(port)
console.log('Listening on port ' + port + '...')

app.get('/test', (req, res) => {
  res.send('hello')
})