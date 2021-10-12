const mongoose = require('mongoose');

const Categories = mongoose.Schema({

    category:{
        type:String,
        min: 1,
        required:true
    },

})

module.exports = new mongoose.model('category',Categories);