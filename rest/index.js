module.exports = function (app) {
    'use strict';

    const express = require('express');
    const router = express.Router();

    // Import API versions
    require('./1.0/index')(router);

    // Expose REST APIs
    app.use('/rest', router);
};
