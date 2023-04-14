const router = require("express").Router();
const BookedChargingStations = require('../Schemas/BookedChargingStationSchema');
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/orders", async (req, res) => {
	const { amount } = req.body;
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

router.post("/verify", async (req, res) => {
	const { userId, stationId, slotBooked, bookedTime, bookedDate, index, bookedDay } = req.body;
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			// return res.status(200).json({ message: "Payment verified successfully" });
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
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

module.exports = router;
