module.exports = function (app) {
    'use strict';

    const mongoose = require('mongoose');
    const cardSchema = require('../../lib/models/cardSchema');
    const Card = mongoose.model('Card', cardSchema);

    app.post('/cardData', (req, res) => {
        const body = req.body;
        if (req.headers['x-secret'] == null || req.headers['x-secret'] !== 'ShhhhImASecret') {
            res.status(400)
            .end();
            return;
        }
        // console.log(`Creating card for data ${JSON.stringify(body)}`);
        Card.create(body, (err, card) => {
            if (err) {
                res.status(400)
                .json(err);
                return;
            }
            res.status(200)
            .end();
        });
    });
    app.delete('/cardData', (req, res) => {
        if (req.headers['x-secret'] == null || req.headers['x-secret'] !== 'ShhhhImASecret') {
            res.status(400)
            .end();
            return;
        }
        Card.remove({}, (err) => {
            if (err) {
                res.status(500)
                .json(err)
                .end();
                return;
            }
            res.status(200)
            .end();
        });
    });
};
