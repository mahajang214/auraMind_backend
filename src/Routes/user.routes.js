const express = require('express');
const { getUserInfo, setupDailyReward } = require('../Controller/user.controller');
const protection = require('../Middlewares/protection');

const router = express.Router();

router.get('/user-info',protection, getUserInfo);
router.patch("/setup-daily-reward", protection, setupDailyReward);

module.exports = router;