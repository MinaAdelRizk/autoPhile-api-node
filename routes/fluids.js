const { Fluid, validate } = require('../models/fluid')
const { Category } = require('../models/category');
const { Seller } = require('../models/seller');
const express = require('express');
const router = express.Router()
const populateSellerListings = require('../middleware/population')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const multer = require('multer');
const { Manufacturer } = require('../models/manufacturer');

router.get('/', async (req, res) => {
    const fluids = await Fluid.find().sort('name');
    res.send(fluids)
})

router.get('/:id', async (req, res) => {
    try {
        const fluid = await Fluid.findById(req.params.id);
        if (!fluid) return res.status(404).send("Cannot find a fluid by the given ID");
        res.send(fluid)
    } catch (error) {
        res.status(500).send("Something went wrong or invalid ID")
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        let name = file["originalname"]
        // name = name.trim()
        //not working as of now
        cb(null, Date.now() + name)
    },
    fileFilter: fileFilter
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});


router.post('/', auth, upload.single('productImage'), async (req, res) => {
    console.log(req.file);

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    // .send(error.details[0].message)

    try {

        const category = await Category.findById(req.body.category)
        if (!category) return res.status(400).send("Invalid Category")

        let seller = await Seller.findById(req.user.sellerId)
        if (!seller) return res.status(404).send("No Seller found with the given seller Id")

        console.log(req.file)
        // let mnf = await Manufacturer.findById(req.body.mnf);
        // if (!mnf) return res.status(404).send("No Manufacturer found with the given ID")

        const fluid = new Fluid({
            title: req.body.title,
            category: { name: category.name, _id: category._id },
            type: req.body.type,
            price: req.body.price,
            vsc: req.body.vsc,
            // mnf: { name: mnf.name, _id: mnf._id },
            mnf: req.body.mnf,
            volume: req.body.volume,
            numberInStock: req.body.numberInStock,
            date: Date.now(),
            seller: {
                _id: seller._id, name: seller.name, rating: seller.rating
            },
            productImage: req.file.path
        });

        console.log(fluid)
        await fluid.save();
        populateSellerListings(seller, fluid)
        res.send(fluid)

    } catch (error) {
        res.status(500).send(error.message)
    }
    // try {
    //     const result = await fluid.save();
    //     if (!result) res.send(result)
    //     res.send(result)
    // } catch (error) {
    //     res.status(500).send(error.message)
    // }
});

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        let seller = await Seller.findById(req.user.sellerId)
        if (!seller) return res.status(404).send("No Seller found with the given seller Id")
        let { listings } = seller
        let index = listings.indexOf({ itemId: req.params.id })
        listings.splice(index, 1)
        await seller.save()
        const fluid = await Fluid.findByIdAndDelete(req.params.id)
        if (!fluid) return res.status(404).send("Cannot find a fluid with the given ID")

        res.send(fluid);
    } catch (error) {
        res.status(500).send("something went wrong or Invalid ID")
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message)

        const category = await Category.findById(req.body.category)
        if (!category) return res.status(400).send("invalid category")

        const fluid = await Fluid.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                category: { name: category.name, _id: category._id },
                type: req.body.type,
                vsc: req.body.vsc,
                mnf: req.body.mnf,
                price: req.body.price,
                volume: req.body.volume,
                numberInStock: req.body.numberInStock
            },
        }, { new: true });

        await fluid.save()

        if (!fluid) return res.status(404).send("Cannot find a Fluid with the given ID")
        res.send(fluid);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router;