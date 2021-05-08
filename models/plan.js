const mongoose = require('mongoose');

const schema = mongoose.Schema({
    title: String,
    cost: String,
    profit:String,
    duration: String,
    description:String,

});

module.exports = mongoose.model('plans',schema)