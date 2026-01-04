const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true, 
    },
    slug: {
        type: String,
        required: false,
        unique: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    sold: {
        type: Number,
        default : 0,
        select : false
    },
    quantity: {
        type: Number,
        required: false,
    },
    images: {
        type: Array,
        required: false,
    },
    color: {
        type: String,
        enum: ["Black", 'Brown', 'Red'],
    },
    ratings: [{
        star: Number,
        postedBy: { type : mongoose.Schema.Types.ObjectId , ref : 'User'},
        review : String
    }],
},{
    timestamps : true
});

productSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

productSchema.pre('findOneAndUpdate',async function (next) {
    const update = this.getUpdate();
    if (update.title) {
        update.slug = slugify(update.title, { lower: true });
    }
    next();
});
module.exports = mongoose.model('Product', productSchema);