const mongoose = require('mongoose');
const schema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        min:2
    },
    email:{
        type:String,
        required:true,
        min:6
    },
    password:{
        type:String,
        required:true,
        min:8
    }
});

module.exports = mongoose.model('user',schema);