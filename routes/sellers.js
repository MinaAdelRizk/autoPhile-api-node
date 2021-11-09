const { Seller, validate } = require('../models/seller');
const { Category } = require('../models/category')
const { User } = require('../models/user')
const express = require('express');
const router = express.Router()
const _ = require('lodash');
const auth = require('../middleware/auth');
const idValidate = require('../middleware/idValidate');

// const Joi = require('joi');

router.get('/', async (req, res) => {
    const seller = await Seller.find().sort('name')
    if (!seller) return res.status(404).send("No sellers found!")
    res.send(seller)
})

// function validateId(id) {
//     const schema = Joi.objectId()
//     return schema.validate(id)
// }

router.get('/:id', idValidate, async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id)
        if (!seller) return res.status(400).send("No Seller found with the given ID")
        res.send(seller)
    } catch (error) {
        res.status(500).send("something went wrong!")
    }
})

//new registration and login 
router.post('/', auth, async (req, res) => {

    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        let seller = await Seller.findOne({ email: req.body.email });
        if (seller) return res.status(400).send("Seller email already registered")

        seller = new Seller({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            specializations: req.body.specializations,
            address: req.body.address,
            rating: req.body.rating
        })

        await seller.save()

        const user = await User.findByIdAndUpdate(req.user._id, {
            $set: {
                isSeller: true
            }
        }, { new: true })

        console.log(user)

        // const token = seller.genAuthToken()

        res.send(_.pick(seller, ['name', 'email', '_id']))

    } catch (error) {
        return res.status(500).send(error.message)
    }

})

router.get('/me', auth, async (req, res) => {
    const seller = await User.findById(req.user._id).select('-password')
    res.send(seller)
})

router.put('/:id', async (req, res) => {

    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        let category = await Category.findById(req.body.listings)
        if (!category) return res.status(400).send("No Category found with the given ID")
        // category = { _id: "Seller ID", name: "No Listings Yet" }

        const count = req.body.listings
        for (let i = 0; i++; i <= count.length) {
            console.log("Mia")
        }
        const seller = await Seller.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                specializations: req.body.specializations,
                address: req.body.address,
                listings: [{ _id: req.body.listings, category: category.name }]
            }
        }, { new: true })

        if (!seller) return res.status(404).send("No Seller Found with the given ID")

        await seller.save()
        res.send(seller)

    } catch (error) {
        res.send(error.message)
    }
})

router.delete('/:id', async (req, res) => {
    const seller = await Seller.findByIdAndDelete(req.params.id)
    if (!seller) return res.status(404).send("no seller found with the given ID")
    res.send(seller)
})

module.exports = router;

