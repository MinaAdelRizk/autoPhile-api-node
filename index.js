const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config')
const mongoose = require('mongoose')
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
const express = require('express');


const app = express();
// app.use(express.json())

app.use(express.json({ limit: '50mb' }));


// const home = require('./routes/home');

// config.get('jwtPrivatekey')

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is undefined');
    process.exit(1)
}

// process.env['ALLOW_CONFIG_MUTATIONS'] = true;


mongoose.connect('mongodb://localhost/autophile', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("connected to AutoPhile database"))
    .catch(err => console.error("Could not connect to MongoDb"))

const options = {
    redirect: false
}


// app.use('/', home);
app.use('/api/uploads/', express.static('uploads', options));
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listning to port ${port}...`));