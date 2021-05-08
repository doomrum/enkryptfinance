const mongoose = require('mongoose');

const schema = mongoose.Schema({
    subject: String,
    msg: String,
    owner:{
        ref: 'users',
        type:mongoose.Schema.Types.ObjectId,
    },
    date:{
        type:Date,
        default:Date.now(),
    }

    
});

module.exports = mongoose.model('supporttickets',schema)