const mongoose = require('mongoose');
var paymentSchema = new mongoose.Schema({
    paymentId:{
        type:String,
        required:true,
        unique:true,
    },
    reference:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:'unpaid',
    },
    amount:{
        type:String,
        required:true,
    },
    currency:{
        type:String,
        required:false,
    },
});
//Export the model
module.exports = mongoose.model('Payment', paymentSchema);