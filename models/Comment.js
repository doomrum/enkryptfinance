const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    comment: {
        type: String,
        required: true,
    }
})
module.exports = mongoose.model('comments',Comment)