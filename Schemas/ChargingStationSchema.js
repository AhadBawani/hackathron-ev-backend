const mongoose = require('mongoose');

const ChargingStationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    chargingStationImage:{
        type:String,
        required:true
    },
    type2:{
        type:Number,
        required:true
    },
    CHAdeMO1:{
        type:Number,
        required:true
    },
    CCS_cable2:{
        type:Number,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    latitude:{
        type:Number,
        required:true
    },
    longitude:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    pincode:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('ChargingStations', ChargingStationSchema);