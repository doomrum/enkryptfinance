const mongoose = require('mongoose');

const schema = mongoose.Schema({
    text: String,
    fromEmail:String,
    toEmail:String,
    owner:{
        ref: 'users',
        type:mongoose.Schema.Types.ObjectId,
    }

});

module.exports = mongoose.model('emails',schema)