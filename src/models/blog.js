const mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    numViews: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});
module.exports = mongoose.model('Blog', blogSchema);