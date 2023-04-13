const BookedChargingStations = require('../Schemas/BookedChargingStationSchema');
const ChargingStationSchema = require('../Schemas/ChargingStationSchema');
const Users = require('../Schemas/UserSchema');

module.exports.ADD_BOOKING = (async (req, res) => {
    const { userId, stationId, slotBooked, bookedTime, bookedDate, index } = req.body;

    BookedChargingStations.findOne({ bookedDate: bookedDate, stationId: stationId, index: index })
        .exec()
        .then(response => {
            if (!response) {
                Users.findById(userId)
                    .exec()
                    .then(userResponse => {
                        if (userResponse) {
                            ChargingStationSchema.findById(stationId)
                                .exec()
                                .then(chargingStationResponse => {
                                    if (chargingStationResponse) {
                                        const bookedChargingStations = new BookedChargingStations({
                                            userId: userId,
                                            stationId: stationId,
                                            slotBooked: slotBooked,
                                            bookedTime: bookedTime,
                                            bookedDate: bookedDate,
                                            index: index
                                        }).save();

                                        try {
                                            bookedChargingStations
                                                .then((response) => {
                                                    res.status(201).json({
                                                        message: "Charging slot booked successfully!",
                                                        detail: {
                                                            id: response._id,
                                                            userId: response.userId,
                                                            stationId: response.stationId,
                                                            slotBooked: response.slotBooked,
                                                            bookedDate: response.bookedDate,
                                                            bookedTime: response.bookedTime
                                                        }
                                                    })
                                                })
                                                .catch((error) => {
                                                    res.status(404).send(error);
                                                })
                                        }
                                        catch (error) {
                                            res.status(404).send(error);
                                        }
                                    }
                                    else {
                                        res.status(404).send({
                                            message: "Charging Station not exists!"
                                        })
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        }
                        else {
                            res.status(404).send({
                                message: "user not found!"
                            })
                        }
                    })
            }
            else{
                res.status(400).send({
                    message : "Charging Slot already booked for you!"
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
})