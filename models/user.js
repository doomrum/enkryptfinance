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
    supporttickets:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'supporttickets'
    } ],
    transactions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transactions'
    }],
    referrals:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'referrals'
    }],
    referralUrl:String,

    balance:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'balance'
    },
    plan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'plan'
    },
    country:{
        type: String
    },
    code:{
        type: String
    },
});

module.exports = mongoose.model('users',schema);