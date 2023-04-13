const express = require('express');
const router = express.Router();
const EVVehicleController = require('../Controller/EVVehicleController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./VehicleImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/',EVVehicleController.GET_ALL_VEHICLE);
router.post('/',  upload.single('vehicleImage') , EVVehicleController.ADD_VEHICLE);

module.exports = router;