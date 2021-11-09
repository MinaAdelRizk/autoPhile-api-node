const Joi = require('joi');
const mongoose = require('mongoose');
const { makeSchema } = require('./make')

const carSchema = new mongoose.Schema({

    name: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 50
    },
    models: {
        type: Array,
        minlength: 1,
        // validate: {
        //     validator: function (v) {
        //         return v && v.length < 0;
        //     },
        //     message: "A Make should have at least one Model."
        // },

        // isPublished: true,
        // required: function () { return this.isPublished }

    }
});

const Car = mongoose.model("Car", carSchema)

function validateCar(car) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50),
        make: Joi.string().min(3).max(50).required(),
        models: Joi.array().min(1).max(50).required()
    })
    return schema.validate(car)
}

module.exports.Car = Car;
module.exports.validate = validateCar;
module.exports.carSchema = carSchema