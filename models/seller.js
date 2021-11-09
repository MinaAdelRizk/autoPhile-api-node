const Joi = require('joi');
const mongoose = require('mongoose');
require('mongoose-type-email');
const jwt = require('jsonwebtoken');
const config = require('config')

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        trim: true,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    specializations: {
        type: Array,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    address: {
        type: String,
        minlength: 10,
        maxlenght: 55,
        required: true
    },
    listings: [Object]
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Tyre',
    ,
    rating: {
        type: Number,
        required: true,
        default: 2.5
    },
    //documents verified = true, validity
})

sellerSchema.methods.genAuthToken = function () {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email }, config.get('jwtPrivateKey'));
    return token
}

const Seller = mongoose.model("Seller", sellerSchema)

function validateSeller(seller) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(9).max(50).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ae', 'org'] } }),
        specializations: Joi.array().required(),
        address: Joi.string().required(),
        listings: Joi.array(),
        rating: Joi.number()
    })
    return schema.validate(seller)
}

module.exports.Seller = Seller;
module.exports.validate = validateSeller;
module.exports.sellerSchema = sellerSchema;