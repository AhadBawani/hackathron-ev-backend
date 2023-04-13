const express = require('express');
const mongoose = require('mongoose');
const user = require('./Routes/User');
const EVVehicles = require('./Routes/EVVehicle');
const ChargingStation = require('./Routes/ChargingStation');
const bodyParser = require('body-parser');
const app = express();
require('dotenv/config');

app.use(bodyParser.json());

app.use('/ChargingStation', ChargingStation);
app.use('/User', user);
app.use('/Vehicle', EVVehicles);

app.get('/', (req, res) => {
    res.send("We are at home ......");
})

app.use((req, res) => {
    res.send({
        message : "Invalid URL"
    })
})

mongoose.connect(process.env.DB_CONNECTION, 
        { useNewUrlParser : true }, console.log('DB CONNECTED!'));

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
});