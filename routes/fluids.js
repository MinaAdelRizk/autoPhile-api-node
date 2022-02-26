const { Fluid, schema, validate } = require('../models/fluid')
const { Category } = require('../models/category');
const { Seller } = require('../models/seller');
const { Manufacturer } = require('../models/manufacturer')
const express = require('express');
const router = express.Router()
const populateSellerListings = require('../middleware/population')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const mongoose = require('mongoose')

const { File } = require('../models/file')
// const upload = multer({ destination: 'uploads/' })

const { upload } = require('../middleware/fileUpload');
const Grid = require('gridfs-stream')
// const { gfs } = require('../routes/files')
const { deleteProductImage } = require('./files');

let assert = require('assert');


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

router.post('/', [auth, upload.single("productImage")], async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const cat = await Category.findById(req.body.category)
        if (!cat) return res.status(400).send("Invalid Category")

        const { manufacturers, types } = cat

        const mnf = manufacturers.find(m => m._id.toString() === req.body.mnf)
        const type = types.find(t => t._id.toString() === req.body.type)

        let seller = await Seller.findById(req.user.sellerId)
        if (!seller) return res.status(404).send("No Seller found with the given seller Id")

        const fluid = new Fluid({
            title: req.body.title,
            category: { name: cat.name, _id: cat._id },
            type: type,
            price: req.body.price,
            vsc: req.body.vsc,
            mnf: mnf,
            volume: req.body.volume,
            numberInStock: req.body.numberInStock,
            date: Date.now(),
            seller: { _id: seller._id, name: seller.name, rating: seller.rating },
            productImage: req.file.filename
        });

        await fluid.save();
        populateSellerListings(seller, fluid)
        res.send(fluid)

    } catch (error) {
        res.status(500).send(error.message)
    }

});


router.delete('/:id', [auth, admin], async (req, res) => {

    const session = await Fluid.startSession();
    await session.withTransaction(async () => {

        try {
            let seller = await Seller.findById(req.user.sellerId).session(session)

            if (req.user.sellerId !== req.params.id && (!req.user.isAdmin)) return res.status(401).send("You can only delete your listings")
            if (!seller) return res.status(400).send("No Seller found with the given seller Id")

            const listings = seller.listings

            const index = listings.indexOf({ itemId: req.params.id })
            listings.splice(index, 1)

            seller.listings = listings
            await seller.save()


            const fluid = await Fluid.findByIdAndDelete(req.params.id).session(session)
            if (!fluid) return res.status(404).send("Cannot find a fluid with the given ID")

            await deleteProductImage(fluid.productImage)

            res.send(fluid);

        } catch (error) {

            console.log(error)
            res.status(500).send(error)
        }
    });
    session.endSession();
});

// router.delete('/:id', [auth, admin], async (req, res) => {
//     try {
//         let seller = await Seller.findById(req.user.sellerId)
//         if (!seller) return res.status(404).send("No Seller found with the given seller Id")
//         let { listings } = seller
//         let index = listings.indexOf({ itemId: req.params.id })
//         listings.splice(index, 1)
//         await seller.save()

//         // const { productImage } = await Fluid.findById(req.params.id)
//         // deleteProductImage(productImage)

//         // if (!file) return res.status(404).send("no image found with the given name")
//         // await File.deleteOne({ filename: productImage })
//         //     .then(console.log("attempt to delete"))
//         // // fs.unlink(object.productImage, (err) => {
//         //     if (err) {
//         //         console.log(err)
//         //     }
//         // })

//         const fluid = await Fluid.findByIdAndDelete(req.params.id)
//         if (!fluid) return res.status(404).send("Cannot find a fluid with the given ID")

//         res.send(fluid);

//     } catch (error) {
//         res.status(500).send(error)
//     }
// });

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