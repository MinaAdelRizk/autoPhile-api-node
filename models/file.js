const Joi = require('joi');
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const File = mongoose.model("File", fileSchema)

function validateFile(file) {
    const schema = Joi.object({
        filename: Joi.string().min(3).max(50).required()
    })
    return schema.validate(file)
}

module.exports.File = File;
module.exports.validate = validateFile;
