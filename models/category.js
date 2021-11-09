const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Category = mongoose.model("Category", categorySchema)

function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    })
    return schema.validate(category)
}

module.exports.Category = Category;
module.exports.validate = validateCategory;
module.exports.categorySchema = categorySchema