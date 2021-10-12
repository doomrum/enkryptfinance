const mongoose = require('mongoose');
const schema = mongoose.Schema({

    title:{
        type:String,
        min: 1,
        max:255,
        required:true
    },
    description:{
        type: [String],
        required: true
    },
    file:{
      type:String,
    },
    status: {
        type:String
    },
    author:{
       type: String
    },
    comments:[
        {type: mongoose.Schema.Types.ObjectId, ref:'comment'}
    ],
    date:{
        type: Date,
        default: Date.now()
    },
    subtitle:String
})

module.exports = mongoose.model('posts',schema);