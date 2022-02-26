const Joi = require('joi');
const mongoose = require('mongoose');
const { categorySchema } = require('./category');

const tyreSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        // maxlength: 60
    },
    category: {
        type: categorySchema,
        required: true
    },
    type: {
        type: Object,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    width: {
        type: Number,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 750
    },
    height: {
        type: Number,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    rim: {
        type: Number,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    year: {
        type: Number,
        required: true,
        minlength: 2018,
        maxlength: 2040
    },
    mnf: {
        type: Object,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        minlength: 0,
        maxlength: 255255
    },
    numberInStock: {
        type: Number,
        trim: true,
        required: true,
        minlength: 0,
        maxlength: 255
    },
    seller: {
        // type: mongoose.Schema.Types.ObjectId,
        type: Object,
        required: true,
    },
    homeInstallation: {
        type: Boolean,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
});

const Tyre = mongoose.model("Tyre", tyreSchema)

function validateTyre(Tyre) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50),
        category: Joi.string().required(),
        type: Joi.string().required(),
        width: Joi.number().required().min(3).max(750),
        height: Joi.number().min(3).max(255).required(),
        rim: Joi.number().min(3).max(255).required(),
        year: Joi.number().min(2018).max(2040).required(),
        mnf: Joi.string().required(),
        price: Joi.number().min(0).max(255255).required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        homeInstallation: Joi.boolean().required(),
        seller: Joi.string().required(),
    })
    return schema.validate(Tyre)
}


module.exports.Tyre = Tyre;
module.exports.validate = validateTyre;
module.exports.tyreSchema = tyreSchema;