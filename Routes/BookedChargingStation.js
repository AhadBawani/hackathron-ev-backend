const express = require('express');
const router = express.Router();
const BookedChargingStationController = require('../Controller/BookedChargingStationController');

router.post('/', BookedChargingStationController.ADD_BOOKING);
router.get('/', BookedChargingStationController.GET_AVERAGE);
router.get('/Predict', BookedChargingStationController.PREDICT);
module.exports = router;