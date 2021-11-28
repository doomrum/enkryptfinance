const mongoose = require('mongoose');
const schema = mongoose.Schema({

    title:{
        type:String,
        min: 1,
        max:255,
        required:true
    },
    description:{
        type: Array,
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
        {type: mongoose.Schema.Types.ObjectId, ref:'comments'}
    ],
    date:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('posts',schema);