const mongoose = require('mongoose');

const schema = mongoose.Schema({
    currentReturns: {
        type: String,
        default: '0'
    },
    currentInvestment:{
        type: String,
        default: '0'
    },
    btcBalance:{
        type: String,
        default: '0'
    },
    owner:{
        ref: 'users',
        type:mongoose.Schema.Types.ObjectId,
    }

});

module.exports = mongoose.model('balances',schema)