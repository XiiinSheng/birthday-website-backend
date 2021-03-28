const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: false,
        default: Date()
    },
    parentPost:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comments', commentSchema);