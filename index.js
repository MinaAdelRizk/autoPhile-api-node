const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config')
const mongoose = require('mongoose')
// @Routes 
const fluids = require('./routes/fluids');
const categories = require('./routes/categories')
const manufacturers = require('./routes/manufacturers')
const makes = require('./routes/makes')
const cars = require('./routes/cars')
const services = require('./routes/services')
const tyres = require('./routes/tyres')
const sellers = require('./routes/sellers')
const users = require('./routes/users')
const auth = require('./routes/auth')
const files = require('./routes/files')

// app.use(express.json({ limit: '50mb' }));

const express = require('express');
const app = express();
app.use(express.json())


if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is undefined');
    process.exit(1)
}

const mongoUri = config.get('MONGODB_URI')
module.exports = mongoUri

// Configuration
console.log("Application Name: " + config.get('name'))
// const mongoUri = 'mongodb://MinaAbdelmalek:autophile1234@autophile-shard-00-00.5gxa9.mongodb.net:27017,autophile-shard-00-01.5gxa9.mongodb.net:27017,autophile-shard-00-02.5gxa9.mongodb.net:27017/AutoPhile?ssl=true&replicaSet=atlas-8vuxga-shard-0&authSource=admin&retryWrites=true&w=majority'

// mongoose.connect(mongoUri, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })
//     .then(() => console.log("connected to AutoPhile database"))
//     .catch(err => console.error("Could not connect to MongoDb"))


// const conn = mongoose.createConnection(config.get('MONGODB_URI'));
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("connected to AutoPhile database"))
    .catch(err => console.error("Could not connect to MongoDb"))
const conn = mongoose.connection
conn.once('open', function () {
    console.log("Connection Successful")
})
conn.on('error', err => {
    logError(err);
})

module.exports = conn;

app.use('/api/fluids', fluids);
app.use('/api/categories', categories);
app.use('/api/manufacturers', manufacturers);
app.use('/api/makes', makes);
app.use('/api/cars', cars)
app.use('/api/services', services)
app.use('/api/tyres', tyres);
app.use('/api/sellers', sellers);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/files', files)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listning to port ${port}...`));