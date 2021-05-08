const mongoose = require('mongoose');

const schema = mongoose.Schema({
    link:{
        type: String,
        required:true
    },
    date:{
      type: Date,
      default: Date.now()
    },
    owner:{
        ref: 'users',
        type:mongoose.Schema.Types.ObjectId,
    }

});

module.exports = mongoose.model('referrals',schema)