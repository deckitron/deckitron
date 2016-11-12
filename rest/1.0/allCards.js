module.exports = function (app) {
    'use strict';

    app.post('/allCards', (req, res) => {
        res.sendStatus(200);
    });
    app.get('/allCards', (req, res) => {
        res.sendStatus(200);
    });
};
