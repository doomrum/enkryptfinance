const mongoose = require('mongoose');
const {dburi} =  require('./dbURI')
mongoose.connect(process.env.DBCONNECTPRODUCTION, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err=>console.log(err));

const db = mongoose.connection;
console.log('loading..db')
db.on('open',()=>{
    console.log('DB CONNECTED')
});


db.on('error',()=>{
    console.log('Error Found')
})

module.exports = db;