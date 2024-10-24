const express = require("express");
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest'); 
const User = require('../models/user');

// Get all the pending connection requests of the loggedIn user
const USER_SAFE_DATA = "firstName lastName";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

// See all the connection
userRouter.get("/user/connections", userAuth, async (req,res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ]
    }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
      
      console.log('connectionRequests: ', connectionRequests);
      const data = connectionRequests.map((row) =>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
          return {
            ...row.toUserId,
            status: row.status,
          }
        }
        return {
          ...row.fromUserId,
          status: row.status,
        }
      });
      res.json({
        message: "Data fetched successfully",
        data: connectionRequests,
      });
  }
  catch(err) {
    req.status(400).send("ERROR: " + err.message);
  }
})

module.exports = userRouter;