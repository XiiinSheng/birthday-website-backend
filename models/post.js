const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
    comment:{
        type: Array,
        required: false,
        default: []
    }
})

module.exports = mongoose.model('Posts', postSchema);