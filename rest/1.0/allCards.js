module.exports = function (app) {
    'use strict';

    const mongoose = require('mongoose');
    const cardSchema = require('../../lib/models/cardSchema');
    const Card = mongoose.model('Card', cardSchema);

    app.get('/allCards', (req, res) => {
        Card.find({})
        .limit(50)
        .exec((err, card) => {
            if (err) {
                res.status(500)
                .send(err.message)
                .end();
                return;
            }
            res.status(200)
            .json(card)
            .end();
        });
    });
};
