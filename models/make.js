const Joi = require('joi');
const mongoose = require('mongoose');

const makeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Make = mongoose.model("Make", makeSchema)

function validateMake(make) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        models: Joi.array()
    })
    return schema.validate(make)
}

module.exports.Make = Make;
module.exports.validate = validateMake;
module.exports.makeSchema = makeSchema