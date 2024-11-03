const express = require("express");
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const { userRequestReceive, userConnections, userFeed } = require("../controllers/User");

// Add userAuth middleware here
router.get("/requests/received", userAuth, userRequestReceive);
router.get("/connections", userAuth, userConnections);
router.get("/feed", userAuth, userFeed);

module.exports = router;
