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
    },
    verified:{
        type: Boolean,
        required: true,

    },
    phone:{
        type: String,
        required: true
    },
    terms:{
        type: Boolean,
        required: true
    },
    urlProofId:{
        type: String,
        default:''
    },
    urlProofResidence:{
        type: String,
        default:''
    },
});

module.exports = mongoose.model('user',schema);