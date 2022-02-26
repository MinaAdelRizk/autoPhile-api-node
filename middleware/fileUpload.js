const multer = require('multer');

const mongoose = require('mongoose')
const path = require('path')
const crypto = require('crypto')
const { GridFsStorage } = require('multer-gridfs-storage')
const Grid = require('gridfs-stream');
const { mongoUri } = require('..');
const config = require('config')
// const conn = require('..');


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


// const conn = mongoose.createConnection(config.get('MONGODB_URI'), {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })


let gfs, gridfsBucket;
mongoose.connection.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    //init stream
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads')
})

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

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});


module.exports.upload = upload;

//file upload local

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + file.originalname)
//     },
//     fileFilter: fileFilter
// });