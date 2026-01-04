const mongoose = require('mongoose'); 


var couponSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        index:true,
    },
    code:{
        type:String,
        required:true,
        unique:true,
    },
    discount:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:false,
    },
});

module.exports = mongoose.model('Coupon', couponSchema);