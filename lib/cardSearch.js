'use strict';

const mongoose = require('mongoose');
const cardSchema = require('./models/cardSchema');
const Card = mongoose.model('Card', cardSchema);

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
function searchCards (searchParams, paging, callback) {
    let pagingOptions = {};
    if (typeof callback !== 'function') {
        throw new Error('Invalid callback');
    }
    if (paging == null) {
        pagingOptions.limit = 50;
        pagingOptions.offset = 0;
    } else {
        pagingOptions.limit = (typeof paging.limit === 'number') ? paging.limit : 50;
        pagingOptions.offset = (typeof paging.offset === 'number') ? paging.offset : 0;
    }
    Card.find(searchParams)
    .skip(pagingOptions.offset)
    .limit(pagingOptions.limit)
    .exec((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
}

function searchByKeyword (keywords, paging, callback) {
    let pagingOptions = {};
    let whereQuery = [];
    if (typeof callback !== 'function') {
        throw new Error('Invalid callback');
    }
    if (paging == null) {
        pagingOptions.limit = 50;
        pagingOptions.offset = 0;
    } else {
        pagingOptions.limit = (typeof paging.limit === 'number') ? paging.limit : 50;
        pagingOptions.offset = (typeof paging.offset === 'number') ? paging.offset : 0;
    }
    for (let i = 0; i < keywords.length; i++) {
        whereQuery.push(`this.name.indexOf('${keywords[i]}') >= 1`);
    }
    Card.find({
        $where: whereQuery.join(' || ')
    })
    .skip(pagingOptions.offset)
    .limit(pagingOptions.limit)
    .exec((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
}

module.exports = {
    searchCards: searchCards,
    searchByKeyword: searchByKeyword
};
