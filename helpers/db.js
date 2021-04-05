const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://enkrypt:enkrypt1234@cluster0.914tq.mongodb.net/enkrypt?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err=>console.log(err));

const db = mongoose.connection;
db.onOpen(()=>console.log('CONNECTED'));
db.onClose('error',(err)=>console.log(err));

module.exports = db;