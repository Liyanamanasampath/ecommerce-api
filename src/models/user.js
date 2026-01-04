const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
 
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        default : 'user'
    },
    is_blocked: {
        type: Boolean,
        required: false,
        default : false
    },
    cart : {
        type : Array,
        default :  []
    },
    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Address',
        required : false
    },
    wishlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : false
    }],
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: false,
    },
    pwd_reset_token: {
        type: String,
        required: false,
    },
    reset_token_exp_at: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
})

userSchema.methods.isPasswordMatch = async function(enterPassword) {
    return await bcrypt.compare(enterPassword,this.password);
}
module.exports = mongoose.model('User', userSchema)