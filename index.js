const express = require('express');
const mongoose = require('mongoose');
const user = require('./Routes/User');
const EVVehicles = require('./Routes/EVVehicle');
const ChargingStation = require('./Routes/ChargingStation');
const BookedChargingStations = require('./Routes/BookedChargingStation');
const payment = require('./Routes/Payment');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
require('dotenv/config');

var dir = path.join(__dirname, "Images");
app.use(express.static(dir));
app.use(cors());
app.use('/ChargingStationImages', express.static('ChargingStationImages'));
app.use('/VehicleImages', express.static('VehicleImages'));
app.use(bodyParser.json());

app.use('/ChargingStation', ChargingStation);
app.use('/User', user);
app.use('/Vehicle', EVVehicles);
app.use('/BookChargingStation', BookedChargingStations);
app.use('/Payment', payment);

app.get('/', (req, res) => {
    res.send("We are at home v3.1.2......");
})

app.use((req, res) => {
    res.send({
        message: "Invalid URL"
    })
})

mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true }, console.log('DB CONNECTED!'))
    .then(() => {
        const chargingStationSchema = new mongoose.Schema({
            name: String,
            location: {
                type: { type: String },
                coordinates: []
            }
        });

        chargingStationSchema.index({ location: "2dsphere" });

        const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

        // You can now use the ChargingStation model to query the collection
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
});