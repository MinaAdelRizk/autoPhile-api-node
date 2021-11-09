const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config')
const jwt = require('jsonwebtoken');
const sellerSchema = require('../models/seller')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    mobile: {
        type: Number,
        trim: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isSp: {
        type: Boolean,
        default: false
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    sellerName: {
        type: String
    },
    selectedCar: {
        type: Object
    }
});

userSchema.methods.generateAuthToken = function () {
    // , selectedCar=this.selectedCar to expose headers
    const token = jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        isAdmin: this.isAdmin,
        isSeller: this.isSeller,
        isSp: this.isSp,
        sellerId: this.sellerId,
        sellerName: this.sellerName,
        selectedCar: this.selectedCar
    }, config.get('jwtPrivateKey'));

    if (!token) console.log("Undefined properties...")
    return token;
}
const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        mobile: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits, 05X XXXX XXX.` }).required(),
        sellerId: Joi.objectId(),
        sellerName: Joi.string().min(3).max(55),
        selectetedCar: Joi.object()
    })
    const result = schema.validate(user)
    console.log(result)
    return result
}

module.exports.User = User;
module.exports.validate = validateUser;
// module.exports.generateAuthToken;