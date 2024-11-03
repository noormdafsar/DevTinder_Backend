const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");


const { requestSend, requestReview } = require("../controllers/Request");

router.post("/send/:status/:toUserId", userAuth, requestSend);
router.post("/review/:status/:requestId", userAuth, requestReview);
  
module.exports = router;