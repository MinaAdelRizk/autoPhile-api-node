const { Manufacturer, validate } = require('../models/manufacturer')
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const idValidate = require('../middleware/idValidate');
const { Category } = require('../models/category');

router.get('/', async (req, res) => {
    const manufacturers = await Manufacturer.find().sort('category');
    res.send(manufacturers)
})

router.get('/:id', idValidate, async (req, res) => {
    const manufacturer = await Manufacturer.findById(req.params.id)
    if (!manufacturer) return res.status(400).send("No Manufacturer found with the given ID")
    res.send(manufacturer)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const category = await Category.findById(req.body.categoryId)
    if (!category) return res.status(400).send("no Category Found with the given Id")

    const duplicate = await Manufacturer.find({ name: req.body.name })
    if (duplicate.length >= 1) return res.status(400).send("Manufacturer name already Exist!")

    const manufacturer = new Manufacturer({
        name: req.body.name,
        category: { name: category.name, _id: category._id }
    })
    const result = await manufacturer.save()
    res.send(result)
})

router.put('/:id', idValidate, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const category = await Category.findById(req.body.categoryId)
        if (!category) return res.status(400).send("no Category Found with the given Id")

        const manufacturer = Manufacturer.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                category: { name: category.name, _id: category._id }
            }
        }, { new: true });

        res.send(manufacturer)

    } catch (error) {
        res.status(500).send(error.message)
    }

})

router.delete("/:id", [idValidate, auth, admin], async (req, res) => {
    const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
    if (!manufacturer) return res.status(404).send("No category found with the given ID!")
    res.send(manufacturer)
})

module.exports = router;