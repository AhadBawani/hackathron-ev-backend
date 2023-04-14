const mongoose = require('mongoose');

const EVVehicleSchema = new mongoose.Schema({    
    vehicleCompany:{
        type:String,
        required:true
    },
    vehicleModel:{
        type:String,
        required:true
    },
    batteryCapacity:{
        type:String,
        required:true
    },
    vehicleImage:{
        type:String,
        required:true
    },
    timeToFullInLevel1:{
        type:String,
        required:true
    },
    timeToFullInLevel2:{
        type:String,
        required:true
    },
    timeToFullInLevel3:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('EVCars', EVVehicleSchema);