const express = require('express');
const router = express.Router();
const BookedChargingStationController = require('../Controller/BookedChargingStationController');

router.post('/', BookedChargingStationController.ADD_BOOKING);

module.exports = router;