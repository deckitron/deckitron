'use strict';

const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, '/public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

app.listen(app.get('port'), () => {
    mongoose.connect('mongodb://192.168.0.17:27017/deckinator');
    console.log('Node app is running at localhost:' + app.get('port'));
});
