const express = require('express');
const router = express.Router();
const ChargingStationController = require('../Controller/ChargingStationController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./ChargingStationImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('chargingStationImage'),ChargingStationController.ADD_CHARGING_STATION);
router.get('/demand/', ChargingStationController.DEMAND);
router.get('/', ChargingStationController.GET_ALL_CHARGING_STATION);

module.exports = router;