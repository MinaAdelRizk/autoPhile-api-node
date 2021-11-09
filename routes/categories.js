const { Category, validate } = require('../models/category')
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const idValidate = require('../middleware/idValidate');

router.get('/', async (req, res) => {
    const categories = await Category.find().sort('name');
    res.send(categories)
})

router.get('/:id', idValidate, auth, async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(400).send("No Category found with the given ID")
    res.send(category)
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const category = new Category({
        name: req.body.name
    })
    const result = await category.save()
    res.send(result)
})

router.put('/:id', idValidate, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const category = Category.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name
            }
        }, { new: true });

        res.send(category)

    } catch (error) {
        res.status(500).send(error.message)
    }

})

router.delete("/:id", [idValidate, auth, admin], async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).send("No category found with the given ID!")
    res.send(category)
})

module.exports = router;