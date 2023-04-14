const mongoose = require('mongoose');

const BookedChargingStationSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref:'User'
    },
    stationId:{
        type:String,
        required:true,
        ref:'ChargingStations'
    },
    slotBooked:{
        type:String,
        required:true
    },
    bookedTime:{
        type:String,
        required:true
    },
    bookedDate:{
        type:String,
        required:true
    },
    chargerType:{
        type:String,
        required:true
    },
    bookedDay :{
        type:String,
        required:true
    },
    index:{
        type:Number,
        required:true
    },
    razorpayId:{
        type:String        
    },
    amount:{
        type:Number
    },
    amountOfCharge:{
        type:String
    }
});

module.exports = mongoose.model('BookedChargingStations', BookedChargingStationSchema);