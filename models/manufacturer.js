const Joi = require('joi');
const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    category: {
        type: Object,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema)

function validateManufacturer(manufacturer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        categoryId: Joi.objectId().min(3).max(50).required()
    })
    return schema.validate(manufacturer)
}

module.exports.Manufacturer = Manufacturer;
module.exports.validate = validateManufacturer;