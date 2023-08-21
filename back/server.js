const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors')
require('dotenv').config();

const authRoutes = require('./routes/auth');
const sauceRoutes = require('./routes/sauce')

const app = express();

console.log(process.env.MONGO_URI)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())

const port = process.env.PORT || 3000

let dbURI = "mongodb+srv://admin:JJHYz1QEzm7EcMtK@autogpt.65oepno.mongodb.net/"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('Connected to MongoDB!')
    app.listen(process.env.PORT || port)
    console.log('Listening on port ' + port + '...')
  })
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('hello')
})


app.use('/api/auth', authRoutes)
app.use('/api/sauces', sauceRoutes)
 