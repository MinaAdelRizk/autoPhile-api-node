const express = require('express')
const router = express.Router()
const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const config = require('config')

const methodOverride = require('method-override')


// const fileUpload = require('../middleware/fileUpload')

let gfs, gridfsBucket;
mongoose.connection.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    //init stream
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads')
})

// creating a storage engine 
const storage = new GridFsStorage({
    url: config.get('MONGODB_URI'),
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                }
                resolve(fileInfo)
            })
        })
    }
})

const upload = multer({ storage })

router.post('/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file })
    res.redirect('/')
})

// @route GET /files
// @desc Display all files in JSON

router.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // check if files 
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: "no files exist"
            })
        }
        return res.json(files)
    })
})

// @route GET /files/:filename
// @desc Display single file in JSON

router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file exist
        if (!file || file.length === 0) {
            return res.status(400).json({ err: "no file found with the given name" })
        }
        // File exists
        return res.json(file)
    });
});

// @route GET /image/:filename
// @desc Display single image

// gfs.files.findById(req.params.id)
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file exist
        if (!file || file.length === 0) {
            return res.status(400).json({ err: "no file found with the given name" })
        }
        // Check if image or not
        if (file.contentType === "image/jpeg" || file.contentType === 'img/png') {
            // Display the image 
            const readstream = gridfsBucket.openDownloadStream(file._id);
            readstream.pipe(res);
        } else {
            res.status(404).json({ err: "Not an image" })
        }
    });
});

// @route Delete /files/:id
// @desc Delete file

router.delete('/:filename', (req, res) => {
    gfs.remove({ filename: req.params.filename, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err })
        }
        // res.redirect('/')
        res.json({ success: "Succcess" })
    })
})

async function deleteProductImage(productImage) {

    await gfs.remove({ filename: productImage, root: 'uploads' })
}


module.exports = router;
module.exports.deleteProductImage = deleteProductImage
module.exports.gfs