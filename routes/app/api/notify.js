const express 		= require('express');
const router 		= express.Router();
const utils 		= require('../../../utils');
const apiMiddleware = require('../../../middleware/api').apiAuth;

router.get('/:id', apiMiddleware, async (req, res) => {
    let deviceId = res.locals.user['deviceId'];
    let appId   = res.locals.user['appId'];
    let campaignId = req.params.id;
    
    await utils.Notify.clicked("CLICKED", deviceId, appId, campaignId);

    res.sendStatus(200);
});


module.exports = router;