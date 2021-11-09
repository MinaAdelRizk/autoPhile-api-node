const { Service, validate } = require('../models/service')
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const idValidate = require('../middleware/idValidate');
const admin = require('../middleware/admin');


router.get('/', async (req, res) => {
    const services = await Service.find().sort('name')
    res.send(services)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return status(400).send(error.details[0].message)

    const service = new Service({
        name: req.body.name
    })

    await service.save()
    res.send(service)
})

router.get('/:id', idValidate, async (req, res) => {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).send("No Service found with the given ID")

    res.send(service)
})

router.put('/:id', [idValidate, auth, admin], async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        const service = await Service.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name
            }
        }, { new: true })

        if (!service) return res.status(404).send("No Service found with the given ID")

        res.send(service)

    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/:id', [idValidate, auth], async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(400).send("No Service found with the given ID")
    res.send(service)
})
module.exports = router;