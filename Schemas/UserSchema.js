const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    EVVehicleId:{
        type:String,
        ref:'EVCars',        
    },
    type:{
        type:String
    }
});

module.exports = mongoose.model('User', UserSchema);