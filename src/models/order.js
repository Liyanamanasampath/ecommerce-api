const mongoose = require('mongoose'); 

var orderSchema = new mongoose.Schema({
    products:[{
       product : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
       },
       qty : Number,
       price : String,
       color : String
    }],
    paymentIntent:{},
    orderStatus:{
        type:String,
        default:"create",
        enum:['create',"in_progress" ,"dispatched","cancelled","delivered"],
    },
    paymentMethod:{
        type:String,
        default:"online",
        enum:['cash',"cash_on_delivery" ,"online","coupon"],
    },
    paymentStatus:{
        type:String,
        default:"unpaid",
        enum:['paid',"unpaid"],
    },
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    total:{
        type:Number,
        required:false,
        default : 0
    },
    subTotal:{
        type:Number,
        required:false,
        default : 0
    },
    discount:{
        type:Number,
        required:false,
        default : 0
    },
    tax:{
        type:Number,
        required:false,
        default : 0
    },
    charges:{
        type:Number,
        required:false,
        default : 0
    },
},{
    timestamps : true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);