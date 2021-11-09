const { Car, validate } = require('../models/car');
const { Make } = require('../models/make')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const cars = await Car.find().sort('name');
    res.send(cars)
})

router.post('/', async (req, res) => {

    try {

        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const make = await Make.findById(req.body.make)
        if (!make) return res.status(400).send('No Car Make cound with the given ID')

        const car = new Car({
            name: `${make.name}`,
            _id: make._id,
            models: req.body.models.map(m => m = { name: m, _id: new mongoose.Types.ObjectId })
            // { name: req.body.models, _id: new mongoose.Types.ObjectId }

        })

        await car.save()
        res.send(car)

    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const car = Car.findById(req.params.id)
        if (!car) return req.status(400).send("No Car found with the given ID")
        let newCar = { ...car }
        newCar.models.push(req.body.models)
        res.send(car)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/:id', async (req, res) => {
    const car = await Car.findById(req.params.id)
    res.send(car)
})
module.exports = router;