const Joi = require('joi');
const mongoose = require('mongoose')

const Service = mongoose.model("Service", new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    }
}))

function validatateService(service) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    })
    return schema.validate(service)
}

module.exports.Service = Service
module.exports.validate = validatateService