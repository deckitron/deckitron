module.exports = function (app) {
    'use strict';

    const mongoose = require('mongoose');
    const setSchema = require('../../lib/models/setSchema');
    const Set = mongoose.model('Set', setSchema);

    app.post('/setData', (req, res) => {
        const body = req.body;
        // console.log(`Creating card for data ${JSON.stringify(body)}`);
        Set.create(body, (err, set) => {
            if (err) {
                res.status(400)
                .json(err);
                return;
            }
            res.status(200)
            .end();
        });
    });
    app.delete('/setData', (req, res) => {
        Set.remove({}, (err) => {
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
