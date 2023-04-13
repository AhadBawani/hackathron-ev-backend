const EVVehicles = require('../Schemas/EVVehicleSchema');

module.exports.GET_ALL_VEHICLE = (async (req, res) => {
    try {
        await EVVehicles.find()
            .exec()
            .then(response => {
                res.status(200).json(response);
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.ADD_VEHICLE = (async (req, res) => {
    const { vehicleName, vehicleCompany, vehicleModel, batteryCapacity, vehicleImage, timeToFullInLevel1, timeToFullInLevel2, timeToFullInLevel3 } = req.body;

    EVVehicles.findOne({ vehicleName: vehicleName, vehicleCompany: vehicleCompany, vehicleModel: vehicleModel })
        .exec()
        .then(response => {
            if (!response) {
                const vehicle = new EVVehicles({                    
                    vehicleCompany: vehicleCompany,
                    vehicleModel: vehicleModel,
                    batteryCapacity: batteryCapacity,
                    vehicleImage: req.file.filename,
                    timeToFullInLevel1: timeToFullInLevel1,
                    timeToFullInLevel2: timeToFullInLevel2,
                    timeToFullInLevel3: timeToFullInLevel3
                }).save();

                try {
                    vehicle
                        .then(response => {
                            if (response) {
                                res.status(201).send({
                                    message: "Vehicle Added successfully!",
                                    vehicle: {
                                        _id: response._id,                                        
                                        vehicleCompany: response.vehicleCompany,
                                        vehicleModel: response.vehicleModel,
                                        batteryCapacity: response.batteryCapacity,
                                        vehicleImage: response.vehicleImage,
                                        timeToFullInLevel1: response.timeToFullInLevel1,
                                        timeToFullInLevel2: response.timeToFullInLevel2,
                                        timeToFullInLevel3: response.timeToFullInLevel3
                                    }
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                catch (error) {
                    console.log(error);
                }
            }
            else{
                res.status(400).send({
                    message: "Vehicle already exists!"
                })
            }
        })
})