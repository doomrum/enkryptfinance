const mongoose = require('mongoose');

const schema = mongoose.Schema({
    type: String,
    amount:{
        type: String,
        required:true,
    },
    status:{
        type: String,
        required:true,
        default: 'pending',
    },
    btcAddress:{
        type: String,
        required:true,
    },
    hash:String,
    hash_plan:{
        ref: 'plans',
        type:mongoose.Schema.Types.ObjectId,
    },
    owner:{
        ref: 'users',
        type:mongoose.Schema.Types.ObjectId,
    }

});

module.exports = mongoose.model('transactions',schema)