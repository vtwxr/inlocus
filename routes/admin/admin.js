const express 			= require('express');
const router			= express.Router();
const utils				= require('../../utils');
const authMiddleware	= require('../../middleware/auth');
const suMiddleware		= require('../../middleware/superadmin');
const model 			= require('../../models');

/**
 * @url: /admin/home
 * @member: GET
 * @template: views/admin/home
 * @desc: Admin Dashboard
 */
router.get('/', authMiddleware, async (req, res) => {
	let beacon = await utils.Sensor.getLatestLocation();
	let repeatVisitors = await model.location.count();
	let totalVisitors = parseInt(repeatVisitors * 1.2);
	let apps = await utils.SdkUser.getUsers(req.user.id);
	res.render('admin/home', { title: 'Admin', layout: 'base', beacon: beacon, repeatVisitors: repeatVisitors, total: totalVisitors, apps: apps });
});


/**
 * @url: /admin/home/analytics
 * @method: GET
 * @template: views/admin/comingsoon
 * @desc: App wise based analytics
 * 
 * @TODO: Implementation
 */
router.get('/analytics', authMiddleware, (req, res) => {
	res.render('admin/comingsoon', { title: 'Admin', layout: 'home' });
});


/**
 * @url: /admin/home/graph
 * @method: GET
 * @desc: JSON data for graph of users seen daywise
 */
router.get('/graph', async(req, res) => {
	let data = await utils.Sensor.countByHour();
	res.json(data);
});


router.get('/pie', async(req, res) => {
	let data = await utils.Sensor.getDeviceCount();
	res.json(data);
});


/**
 * @url: /admin/home/users
 * @method: GET
 * @template: views/superadmin/usermanagement
 * @desc: Manage SuperUsers, Admin Users and Staff Users
 * 
 * @TODO: Add editing user roles and disabling login 
 */
router.get('/users', suMiddleware, async (req, res) => {
	let Users = await utils.User.findAll();
	let staffUsers = await utils.User.findStaff();
	res.render('superadmin/usermanagement', { title: 'Admin', layout: 'base', adminuser: JSON.parse(Users), staff: JSON.parse(staffUsers) });
});


/**
 * Create New App POST
 * URL: /admin/home/app/new
 */
router.post('/app/new', suMiddleware, async (req, res) => {
	let name = req.body.app_name;
	let api_key = req.body.api_key;
	let api_secret = req.body.api_secret;
	try {
		let app = await utils.Application.registerApplication(name, api_key, api_secret);
	} catch (err) {
		res.redirect('/admin/home/app/new');
		return;
	}
	res.redirect('/admin/home/apps');
});


/**
 * @url: /admin/home/apps
 * @method: GET
 * @template: views/superadmin/apps.handlebars
 * @desc: List View of all Applications
 */
router.get('/apps', suMiddleware, async (req, res) => {
	let apps = await utils.Application.findAll();
	res.render('superadmin/apps', { title: 'Admin', layout: 'base', application: apps });
});


/**
 * @url: /admin/home/locations
 * @method: GET
 * @template: views/superadmin/managelocation.handlebars
 * @desc: Display all available locations ( restricted to superadmins )
 */
router.get('/locations', suMiddleware, async(req, res) => {
	let locations = await utils.LocationMaster.getAllSuperadminLocations();
	res.render('superadmin/managelocation', { title: 'Locations Master', layout: 'base', locations: locations });
});


/**
 * @url: /admin/home/beacon
 * @method: GET
 * @template: views/superadmin/newbeacon.handlebars
 * @desc: Add new publicly available beacon
 */
router.get('/beacon', suMiddleware, async(req, res) => {
	let locations = await utils.LocationMaster.getAllSuperadminLocations();
	res.render('superadmin/newbeacon', { title: 'Beacon Master', layout: 'base', locations: locations })
});


/**
 * @url: /admin/home/beacon
 * @method: POST
 * @desc: Add new public beacon
 * 
 */
router.post('/beacon', suMiddleware, async(req, res) => {
	let major = req.body.major;
	let minor = req.body.minor;
	let shortlink = req.body.shortlink;
	let uuid = req.body.uuid;
	let location = req.body.location;
	let ctags = req.body.ctags
	let pretags = req.body.pretags
	// await BeaconMaster.addNewBeacon(major, minor, uuid, shortlink, location);
	// console.log({major,minor,shortlink,uuid,location,ctags,pretags});
	res.redirect('/admin/home/beacon');
});


/**
 * @url: /admin/home/beacons
 * @method: GET
 * @template: views/superadmin/managebeacon 
 * @desc: View all beacons in a datatable
 */
router.get('/beacons', suMiddleware, async(req, res) => {
	let beacons = await utils.BeaconMaster.getAllBeacons();
	res.render('superadmin/managebeacon', { title: 'Beacon Master', layout: 'base', beacons: beacons })
});


/**
 * @url: /admin/home/beacon/:id
 * @method: GET
 * @template: views/superadmin/beacon
 * @desc: Edit beacon
 */
router.get('/beacon/:id', suMiddleware, async(req, res) => {
	let beacon = await utils.BeaconMaster.findOne(req.params.id);
	let locations = await utils.LocationMaster.getAllSuperadminLocations();
	let tags = [];
	beacon.tags.map(tag => {
		tags.push(tag.tag);
	})
	res.render('superadmin/beacon', { title: 'Beacon Master', layout: 'base', beacon: beacon, locations: locations, tag: tags.join(',') })
});


/**
 * @url: /admin/home/beacon/:id
 * @method: POST
 * @desc: Save beacon edits
 * 
 */
router.post('/beacon/:id', suMiddleware, async(req, res) => {
	let id = req.params.id;
	let major = req.body.major;
	let minor = req.body.minor;
	let shortlink = req.body.shortlink;
	let uuid = req.body.uuid;
	let location = req.body.location;
	await utils.BeaconMaster.findOneAndUpdate(id, major, minor, uuid, shortlink, location);
	res.redirect('/admin/home/beacons');
});


/**
 * @url: /admin/home/profile/:id
 * @method: GET
 * @template: views/admin/userprofile.handlebars
 * @desc: App User Profile
 * 
 * @todo: Add beacon and wifis and heat map
 */
router.get('/profile/:id', authMiddleware, async (req, res) => {
	let lastNotif = '';
	let lastNotifc = '';
	let locations = await model.location.findAll({ where: { deviceId: req.params.id }, order: [['createdAt', 'DESC']] });
	let deviceId = await model.device.findOne({where: {id: req.params.id}, include:[{model:model.appuser, include: {model:model.application}}]});
	let countClicked = await model.notify.count({ where: { status: 'CLICKED', deviceId: req.params.id} });
	let countSent = await model.notify.count({ where: { status: 'SENT', deviceId: req.params.id} });
	let notif = await model.notify.findOne({where:{status: 'SENT', deviceId: req.params.id}, order: [['createdAt', 'DESC']] });
	try {lastNotif = '' + notif.createdAt.getDate() + '/' + (notif.createdAt.getMonth() + 1) + '/' + (notif.createdAt.getYear() + 1900);} catch (err) {}
	let notifc = await model.notify.findOne({where:{status: 'SENT'}, order: [['createdAt', 'DESC']] });
	try {lastNotifc = '' + notif.createdAt.getDate() + '/' + (notif.createdAt.getMonth() + 1) + '/' + (notif.createdAt.getYear() + 1900);} catch (err) {}
	let beacons = await utils.BeaconMaster.getAllBeaconData(req.params.id);
	let lastBeacon = await utils.BeaconMaster.lastBeacon(req.params.id);
	res.render('admin/userprofile', { title: 'Admin', layout: 'base', location: locations, tid: req.params.id, device:deviceId, countClicked: countClicked, countSent: countSent, lastNotif: lastNotif, lastNotifc:lastNotifc, beacons: beacons });
});


/**
 * @url: /admin/home/profile/:id/:long
 * @method: GET
 * @template: views/admin/viewonmap.handlebars
 * @desc: View User Lat,Long on Map
 */
router.get('/profile/:id/:long', authMiddleware, async (req, res) => {
	let data = await model.location.find({where: {id: req.params.long, deviceId: req.params.id}});
	let deviceId = await model.device.findOne({where: {id: req.params.id}})
	res.render('admin/viewonmap', { title: 'Admin', layout: 'base', data: data, deviceId: deviceId });
});


module.exports = router;