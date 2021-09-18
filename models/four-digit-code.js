const mongoose = require('mongoose');

const schema = mongoose.Schema({
    code: String,
    owner:{
        ref: 'users',
        type:mongoose.Schema.Types.ObjectId,
    },
    date:{
        type:Date,
        default:Date.now(),
    }

    
});

module.exports = mongoose.model('accessCodes',schema)