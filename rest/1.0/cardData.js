module.exports = function (app) {
    'use strict';

    const mongoose = require('mongoose');
    const cardSchema = require('../../lib/models/cardSchema');
    const Card = mongoose.model('Card', cardSchema);

    app.post('/cardData', (req, res) => {
        const body = req.body;
        // console.log(`Creating card for data ${JSON.stringify(body)}`);
        Card.create(body, (err, card) => {
            if (err) {
                res.status(400)
                .send(err.message);
                return;
            }
            res.status(200)
            .end();
        });
    });
    app.delete('/cardData', (req, res) => {
        Card.remove({}, (err) => {
            if (err) {
                res.status(500)
                .send(err.message)
                .end();
                return;
            }
            res.status(200)
            .end();
        });
    });
};
