const Users = require('../Schemas/UserSchema');
const EVVehicles = require('../Schemas/EVVehicleSchema');

module.exports.SIGNUP_USER = (async (req, res) => {
    const { username, phoneNumber, email, password, EVVehicleId } = req.body;

    await Users.findOne({ phoneNumber: phoneNumber })
        .exec()
        .then((response) => {
            if (!response) {
                EVVehicles.findById(EVVehicleId)
                    .exec()
                    .then(vehicleResponse => {
                        if (vehicleResponse) {
                            const user = new Users({
                                username: username,
                                email: email,
                                phoneNumber: phoneNumber,
                                password: password,
                                EVVehicleId: EVVehicleId,
                                type: "Customer"
                            }).save();

                            try {
                                user
                                    .then((response) => {
                                        res.status(201).json({
                                            message: "User created successfully!",
                                            user: {
                                                _id: response._id,
                                                username: response.username,
                                                phoneNumber: response.phoneNumber,
                                                email: response.email,
                                                password: response.password,
                                                EVVehicleId: vehicleResponse,
                                                type: response.type
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
                                message: "Vehicle doesn't exists!"
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            else {
                res.status(404).send({
                    message: "User already exist!"
                })
            }
        })
        .catch(error => {
            console.log(error);
        })
})

module.exports.LOGIN_USER = (async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        Users.findOne({ phoneNumber: phoneNumber }).populate('EVVehicleId')
            .exec()
            .then(response => {
                if (response) {
                    if (response.password === password) {
                        res.status(200).json({
                            _id: response._id,
                            username: response.username,
                            email: response.email,
                            phoneNumber: response.phoneNumber,
                            vehicle: response.EVVehicleId,
                            type: response.type
                        })
                    }
                    else {
                        res.status(400).send({
                            message: "Invalid Password!"
                        })
                    }
                }
                else {
                    res.status(404).send({
                        message: "User not Found!"
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
})

module.exports.ADMIN_SIGNUP = (async (req, res) => {
    const { username, phoneNumber, email, password, adminKey } = req.body;

    try {
        await Users.findOne({ phoneNumber: phoneNumber })
            .exec()
            .then(response => {
                if (!response) {
                    if (adminKey === process.env.admin_key) {
                        const user = new Users({
                            username: username,
                            email: email,
                            phoneNumber: phoneNumber,
                            password: password,
                            type: "Admin"
                        }).save();

                        try {
                            user
                                .then((response) => {
                                    res.status(201).json({
                                        message: "User created successfully!",
                                        user: {
                                            _id: response._id,
                                            username: response.username,
                                            phoneNumber: response.phoneNumber,
                                            email: response.email,
                                            password: response.password,
                                            type: response.type
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
                            message: "Admin key doesn't match!"
                        })
                    }
                }
            })
    }
    catch (error) {
        console.log(error);
    }
})