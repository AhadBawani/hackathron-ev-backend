const ChargingStation = require('../Schemas/ChargingStationSchema');
const BookedChargingStation = require('../Schemas/BookedChargingStationSchema');

module.exports.ADD_CHARGING_STATION = (async (req, res) => {
    const { name, type2, CHAdeMO1, CCS_cable2, area, street, latitude, longitude, pincode } = req.body;

    ChargingStation.findOne({ name: name, latitude: latitude, longitude: longitude })
        .exec()
        .then(response => {
            if (!response) {
                const chargingStation = new ChargingStation({
                    name: name,
                    chargingStationImage: req.file.filename,
                    type2: type2,
                    CHAdeMO1: CHAdeMO1,
                    CCS_cable2: CCS_cable2,
                    area: area,
                    street: street,
                    latitude: latitude,
                    longitude: longitude,
                    pincode: pincode
                }).save();

                try {
                    chargingStation
                        .then((response) => {
                            res.status(201).send({
                                message: "Charging Station added successfully!",
                                ChargingStation: {
                                    name: response.name,
                                    chargingStationImage: response.chargingStationImage,
                                    type2: response.type2,
                                    CHAdeMO1: response.CHAdeMO1,
                                    CCS_cable2: response.CCS_cable2,
                                    area: response.area,
                                    street: response.street,
                                    latitude: response.latitude,
                                    longitude: response.longitude,
                                    date: response.date,
                                    pincode: response.pincode
                                }
                            })
                        })
                        .catch(error => {
                            res.status(404).send(error);
                        })
                }
                catch (error) {
                    res.status(404).send(error);
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
})

module.exports.GET_ALL_CHARGING_STATION = (async (req, res) => {    
    
    try{
        var arr = [];

        const chargingStations = await ChargingStation.find();
        console.log(chargingStations[1]);
        for(let i = 0; i < chargingStations.length; i++){
            const bookedIndexes = await BookedChargingStation.find({ stationId:chargingStations[i]?._id }).select('index');
            
            const obj = {
                id:chargingStations[i]._id,
                name:chargingStations[i].name,
                chargingStationImage:chargingStations[i].chargingStationImage,                
                latitude:chargingStations[i].latitude,
                longitude:chargingStations[i].longitude,
                type2:chargingStations[i].type2,
                CHAdeMO1:chargingStations[i].CHAdeMO1,
                CCS_cable2:chargingStations[i].CCS_cable2,
                area:chargingStations[i].area,
                street:chargingStations[i].street,
                pincode:chargingStations[i].pincode,
                indexes:bookedIndexes,
            }
            arr.push(obj);
        }
        
        res.json(arr);
    }
    catch(error){
        console.log(error);
    }
})