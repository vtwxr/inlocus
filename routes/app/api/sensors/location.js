const express 		= require('express');
const router		= express.Router();
const utils 		= require('../../../../utils');
const apiMiddleware = require('../../../../middleware/api').apiAuth;
const _				= require('lodash');
const Cache			= require('../../../../campaign/cache').getCampaign;

/**
 * @url: /api/sensor/location
 * @method: PUT
 * @header: authorization: Bearer <TOKEN>
 * @body: { latitude, longitude } 
 * @desc: Takes location information from device and sends
 * 	campaign to the device if available 
 * 
 * @todo: Create notification payload based on campaign
 * 	type
 */
router.put('/', apiMiddleware, async (req, res) => {

	if(!req.is('application/json')){
		res.sendStatus(400);
		return;
	}	

	let payload = req.body;
	let deviceId = res.locals.user['deviceId'];
	let location = undefined;

	let expected_keys = ["latitude", "longitude"];
	let actual_keys = Object.keys(payload);

	if(!_.isEqual(expected_keys.concat().sort(), actual_keys.concat().sort())) {
		res.sendStatus(400);
		return;
	} else {
		try {
			location = await utils.Sensor.saveLocation(payload["latitude"], payload["longitude"], deviceId);
		} catch(err) {
			let er = err.name;
			er = er.replace(/Sequelize/gi, '');
			er = er.replace(/([A-Z])/g, ' $1').trim()
			res.status(400).send({ 'code': 400, 'message': er });
			return;
		}
	}

	let id = await utils.Campaign.getOneLocationCampaign(res.locals.user['appId'], payload['latitude'], payload['longitude'], location);

	if(id) {
		let campaign = await Cache(id, deviceId);
		if(campaign) {
			let clicked = await utils.Notify.sent("SENT", deviceId, res.locals.user['appId'], campaign.id, "LOCATION");
			let notif_payload = {
				"campaignId": campaign.id,
				"campaignType": campaign.type,
				"notificationId": clicked.id,
				"campaign": {
					"title": campaign.title,
					"content": {
						"text": campaign.body,
						"uri": campaign.action,
					},
					"filters": campaign.filters,
					"count": "0",
					"inlocusID": res.locals.user['inlocusId']
				}
			}
			res.json(notif_payload);
		} else {
			res.sendStatus(204)
		}
	} else {
		res.sendStatus(204);
	}
	
});

module.exports = router;
