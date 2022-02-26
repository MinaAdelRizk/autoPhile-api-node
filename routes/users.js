const { User, validate } = require('../models/user')
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const _ = require('lodash')

const { Seller } = require('../models/seller');

//get users
router.get('/', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

//create user
router.post('/', async (req, res) => {

    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already registered")

        user = new User(_.pick(req.body, ['name', 'email', 'password', 'mobile', 'isAdmin', 'isSeller', 'isSp', 'seller', 'selectedCar']));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()

        const token = user.generateAuthToken()

        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'mobile', 'seller', 'selectedCar["carName"]']))

    } catch (error) {
        res.status(500).send(error.message)
    }
})


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})


// router.put('/:id', async (req, res) => {

//     try {
//         const { error } = validate(req.body)
//         if (error) return res.status(400).send(error.details[0].message)

//         const seller = await Seller.findById(req.body.sellerId)
//         if (!seller) return res.status(400).send("No Seller found with the given Id")

//         const user = await User.findByIdAndUpdate(req.params.id, {
//             $set: {
//                 sellerId: seller._id,
//                 sellerName: seller.name
//             }
//         }, { new: true })

//         if (!user) return res.status(404).send("No User Found")
//     } catch (error) {
//         res.status(500).send(error.message)
//     }

// });

router.put('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        console.log(user)

        user.selectedCar = {
            selectedModel: req.body.selectedModel,
            selectedMake: req.body.selectedMake,
            carName: `${req.body.make} ${req.body.model} ${req.body.year}`
        }

        console.log(user)

        await user.save()

        res.send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})
router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(400).send("No user found with the given ID!")
    res.send(_.pick(user, ['name', 'email', '_id']))
})

module.exports = router;