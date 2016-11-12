module.exports = function (app) {
    'use strict';

    const express = require('express');
    const router = express.Router();

    // Import REST APIs
    require('./allCards')(router);

    // Expose 1.0 APIs
    app.use('/1.0', router);
};
