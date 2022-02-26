const Joi = require('joi');
const mongoose = require('mongoose');
const { categorySchema } = require('./category');

const fluidSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 2
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Category',
        // type: categorySchema,
        type: Object,
        required: true,
    },
    type: {
        type: Object,
        required: true,
        minlength: 1,
    },
    price: {
        type: String,
        required: true,
        minlength: 1
    },
    vsc: {
        type: String,
        required: true,
        minlength: 2
    },
    mnf: {
        type: Object,
        required: true,
        minlength: 2
    },
    volume: {
        type: String,
        reqyured: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    // date: {
    //     type: Date,
    // },
    seller: {
        // type: mongoose.Schema.Types.ObjectId,
        type: Object,
        required: true,
    },
    productImage: {
        type: String,
        required: true
    }
});

const Fluid = mongoose.model("Fluid", fluidSchema)

function validateFluid(fluid) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        category: Joi.string().required(),
        type: Joi.string().min(3).max(50).required(),
        vsc: Joi.string().min(3).max(50).required(),
        mnf: Joi.string().min(3).max(50).required(),
        price: Joi.string().required(),
        volume: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        seller: Joi.string().required(),
        productImage: Joi.string()
    })

    const value = schema.validate(fluid)
    return value
}

module.exports.Fluid = Fluid;
module.exports.validate = validateFluid;
module.exports.schema = fluidSchema