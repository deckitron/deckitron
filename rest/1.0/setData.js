module.exports = function (app) {
    'use strict';

    const mongoose = require('mongoose');
    const setSchema = require('../../lib/models/setSchema');
    const Set = mongoose.model('Set', setSchema);

    app.post('/setData', (req, res) => {
        const body = req.body;
        if (req.headers['x-secret'] == null || req.headers['x-secret'] !== 'ShhhhImASecret') {
            res.status(400)
            .end();
            return;
        }
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
        if (req.headers['x-secret'] == null || req.headers['x-secret'] !== 'ShhhhImASecret') {
            res.status(400)
            .end();
            return;
        }
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
