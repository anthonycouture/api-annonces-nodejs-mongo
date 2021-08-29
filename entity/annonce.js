const mongoose = require('mongoose');

const annonceSchema = mongoose.Schema({
    id: {type: Number, require: true},
    title: {type: String, required: true},
});

module.exports = mongoose.model('annonce', annonceSchema, 'annonce');