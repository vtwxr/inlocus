const express 	= require('express');
const router	= express.Router();
const Sensor 	= require('../../../../utils/Sensor');
const apiMiddleware = require('../../../../middleware/api').apiAuth;
const _				= require('lodash');

/**
 * url /api/sendsor/beacon
 * method PUT
 * header authorization: Bearer <TOKEN>
 * body uuid, major, minor, rssi, distance
 */ 
router.put('/', apiMiddleware, async (req, res) => {

	if(!req.is('application/json')){
		res.sendStatus(400);
		return;
	}	

	let payload = req.body;
	let deviceId = res.locals.user['deviceId'];

	let expected_keys = ["uuid", "major", "minor", "rssi", "distance"];
	let actual_keys = Object.keys(payload);

	if(!_.isEqual(expected_keys.concat().sort(), actual_keys.concat().sort())) {
		res.sendStatus(400);
		return;
	} else {
		let beacon = undefined;
		let location = undefined;
		try {
			beacon = await Sensor.saveBeacon(payload["major"], payload["minor"], payload["uuid"], payload["rssi"], payload["distance"], deviceId);
		} catch (err) {
			let er = err.name;
			er = er.replace(/Sequelize/gi, '');
			er = er.replace(/([A-Z])/g, ' $1').trim()
			res.status(400).send({ 'code': 400, 'message': er });
			return;
		}
	}

	res.status(201).send({'title': "", 'body': {}})
});

module.exports = router;