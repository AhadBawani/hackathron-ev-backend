const BookedChargingStations = require('../Schemas/BookedChargingStationSchema');
const ChargingStationSchema = require('../Schemas/ChargingStationSchema');
const Users = require('../Schemas/UserSchema');
const moment = require('moment');

module.exports.ADD_BOOKING = (async (req, res) => {
    const { userId, stationId, slotBooked, bookedTime, bookedDate, index, bookedDay } = req.body;

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
                                            bookedDay: bookedDay,
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
                                                            bookedTime: response.bookedTime,
                                                            bookedDay: response.bookedDay
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
            else {
                res.status(400).send({
                    message: "Charging Slot already booked for you!"
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
})

module.exports.GET_AVERAGE = (async (req, res) => {
    try {
        const allOrders = await BookedChargingStations.find();

        const result = allOrders.reduce(function (r, a) {
            r[a.bookedDay] = r[a.bookedDay] || [];
            r[a.bookedDay].push(a);
            return r;
        }, Object.create(null));

        const dateString = allOrders[0].bookedDate;
        const dateObject = new Date(dateString.split('-').reverse().join('-'));
        const reversedDate = dateObject.toISOString().slice(0, 10);

        const firstOrderDate = moment();
        const currentDate = moment(reversedDate);

        const numWeeks = Math.floor(currentDate.diff(firstOrderDate, 'weeks', true));
        
        const obj = {
            weeks:parseInt(numWeeks + 1),
            result:result
        }
        res.json(obj);
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.PREDICT = (async (req, res) => {
    const arr = [];
    try{        
        const allOrders = await BookedChargingStations.find();
        const dateString = allOrders[0].bookedDate;
        const dateObject = new Date(dateString.split('-').reverse().join('-'));
        const reversedDate = dateObject.toISOString().slice(0, 10);

        const firstOrderDate = moment();
        const currentDate = moment(reversedDate);

        const numWeeks = Math.floor(currentDate.diff(firstOrderDate, 'weeks', true));

        arr.push({ numberOfWeeks:parseInt(numWeeks + 1) })
        const allStation = await ChargingStationSchema.find();

        for(let i = 0; i < allStation.length; i++){            
            await BookedChargingStations.find({ stationId:allStation[i]?._id })
            .exec()
            .then(response => {
                const groupedOrders = response.reduce((acc, order) => {
                    const key = `${order.bookedDate}-${order.bookedDay}`;
                    if (!acc[key]) {
                      acc[key] = [];
                    }
                    acc[key].push(order);
                    return acc;
                  }, {});
                  
                let obj = {
                    stationId:allStation[i]._id,
                    latitude:allStation[i].latitude,
                    longitude:allStation[i].longitude,
                    totalOrders:response.length,
                    subOrders : groupedOrders
                }
                arr.push(obj);
            })
            .catch(error => {
                console.log(error);
            });            
        }
        res.json(arr);
    }
    catch(error){
        console.log(error);
    }
})