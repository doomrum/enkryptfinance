const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// mongoose.connect(`${process.env.DBCONNECT}`,{useUnifiedTopology:true,useNewUrlParser:true})
mongoose.connect('mongodb://localhost:27017/enkrypt', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.onOpen(()=>console.log('CONNECTED'));
db.onClose('error',(err)=>console.log(err));

module.exports = db;