'use strict';

const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.listen(app.get('port'), () => {
    console.log('Node app is running at localhost:' + app.get('port'));
});
