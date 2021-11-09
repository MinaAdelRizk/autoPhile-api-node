const { Make, validate } = require('../models/make')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const idValidate = require('../middleware/idValidate');

router.get('/', async (req, res) => {
    const makes = await Make.find().sort('name');
    res.send(makes)
})

router.get('/:id', idValidate, async (req, res) => {

    try {
        const make = await Make.findById(req.params.id)
        if (!make) return res.status(400).send("No Car Make found with the given ID")
        res.send(make)
    } catch (error) {
        return res.status(400).send("No Result")
    }

})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const make = new Make({
        name: req.body.name,
        models: [{ name: req.body.models, _id: new mongoose.Types.ObjectId() }]
    })
    const result = await make.save()
    res.send(result)
})

router.put('/:id', idValidate, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const make = Make.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                make: req.body.make,
                models: [req.body.models]
            }
        }, { new: true });

        res.send(make)

    } catch (error) {
        res.status(500).send(error.message)
    }

})

router.delete("/:id", [idValidate, auth, admin], async (req, res) => {
    const make = await Make.findByIdAndDelete(req.params.id);
    if (!make) return res.status(404).send("No category found with the given ID!")
    res.send(make)
})

module.exports = router;