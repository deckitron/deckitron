'use strict';

const mongoose = require('mongoose');
const cardSchema = require('./models/cardSchema');
const setSchema = require('./models/setSchema');
const Card = mongoose.model('Card', cardSchema);
const Set = mongoose.model('Set', setSchema);

function searchBySet (sets, filters, paging, sorting, callback) {
    const pagingOptions = {};
    let sortingOptions = {};
    if (typeof callback !== 'function') {
        throw new Error('Invalid callback');
    }
    if (sorting == null) {
        sortingOptions.releaseDate = 'desc';
    } else {
        sortingOptions = sorting;
    }
    if (paging == null) {
        pagingOptions.limit = 50;
        pagingOptions.offset = 0;
    } else {
        pagingOptions.limit = (typeof paging.limit === 'number') ? paging.limit : 50;
        pagingOptions.offset = (typeof paging.offset === 'number') ? paging.offset : 0;
    }
    Set.find(sets)
    .exec((err, data) => {
        let cardIDs = [];
        const params = Object.create(filters);
        if (err) {
            callback(err, null);
            return;
        }
        for (let i = 0; i < data.length; i++) {
            cardIDs = cardIDs.concat(data[i].cards);
        }
        params.id = {
            $in: cardIDs
        };
        if (params.artist) {
            params.artist = new RegExp(params.artist, 'i');
        }
        let q = Card.find(params)
        .sort(sortingOptions);
        if (pagingOptions.offset >= 0) {
            q = q.skip(pagingOptions.offset);
        }
        if (pagingOptions.limit < 1) {
            q = q.limit(pagingOptions.limit);
        }
        q.exec((e, cards) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, cards);
        });
    });
}

function getDistinctPlaneswalkers (callback) {
    Card.find({
        types: ['Planeswalker']
    })
    .distinct('subtypes')
    .exec((err, cards) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, cards);
    });
}

/**
 * Search for cards.
 *
 * @param {Object} searchParams The parameters to use for the search.
 * @param {Object} [paging] The paging options.
 * @param {Function} callback The function to call once the operation has
 * completed.
 *
 * @throws {Error} If the callback is not a function.
 */
function searchCards (searchParams, paging, sorting, callback) {
    const pagingOptions = {};
    const params = Object.create(searchParams);
    let sortingOptions = {};
    if (typeof callback !== 'function') {
        throw new Error('Invalid callback');
    }
    if (sorting == null) {
        sortingOptions.releaseDate = 'desc';
    } else {
        sortingOptions = sorting;
    }
    if (paging == null) {
        pagingOptions.limit = 50;
        pagingOptions.offset = 0;
    } else {
        pagingOptions.limit = (typeof paging.limit === 'number') ? paging.limit : 50;
        pagingOptions.offset = (typeof paging.offset === 'number') ? paging.offset : 0;
    }
    if (params.artist) {
        params.artist = new RegExp(params.artist, 'i');
    }
    let q = Card.find(params)
    .sort(sortingOptions);
    if (pagingOptions.offset >= 0) {
        q = q.skip(pagingOptions.offset);
    }
    if (pagingOptions.limit >= 1) {
        q = q.limit(pagingOptions.limit);
    }
    q.exec((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
}

function searchByKeyword (keywords, filters, paging, sorting, callback) {
    const pagingOptions = {};
    let sortingOptions = {};
    const params = Object.create(filters);
    if (typeof callback !== 'function') {
        throw new Error('Invalid callback');
    }
    if (sorting == null) {
        sortingOptions.releaseDate = 'desc';
    } else {
        sortingOptions = sorting;
    }
    if (paging == null) {
        pagingOptions.limit = 50;
        pagingOptions.offset = 0;
    } else {
        pagingOptions.limit = (typeof paging.limit === 'number') ?
            paging.limit : 50;
        pagingOptions.offset = (typeof paging.offset === 'number') ?
            paging.offset : 0;
    }
    if (params.artist) {
        params.artist = new RegExp(params.artist, 'i');
    }
    if (keywords) {
        params.$text = {
            $search: keywords
        };
    }
    let q = Card.find(params)
    .sort(sortingOptions);
    if (pagingOptions.offset >= 0) {
        q = q.skip(pagingOptions.offset);
    }
    if (pagingOptions.limit >= 1) {
        q = q.limit(pagingOptions.limit);
    }
    q.exec((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
}

module.exports = {
    searchCards: searchCards,
    searchBySet: searchBySet,
    searchByKeyword: searchByKeyword,

    getDistinctPlaneswalkers: getDistinctPlaneswalkers
};
