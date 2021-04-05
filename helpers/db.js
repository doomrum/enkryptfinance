const mongoose = require('mongoose');
const {dburi} =  require('./dbURI')
mongoose.connect(dburi(), {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err=>console.log(err));

const db = mongoose.connection;
db.onOpen(()=>console.log('CONNECTED'));
db.onClose('error',(err)=>console.log(err));

module.exports = db;