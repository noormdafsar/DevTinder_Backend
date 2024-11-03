const ConnectionRequest = require('../models/connectionRequest'); 
const User = require('../models/user');
//const { validateEditProfileData } = require('../utils/validation');


const USER_SAFE_DATA = "firstName lastName";

const userRequestReceive = async (req, res) => {
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
};

const userConnections =  async (req,res) => {
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
          data: data,
        });
    }
    catch(err) {
      req.status(400).send("ERROR: " + err.message);
    }
};

const userFeed = async(req,res) => {
    try {
      const loggedInUser = req.user;
  
      const page = req.query.page || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit >50 ? 50 : limit;
      const skip = (page - 1) * limit;
  
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
      }).select("fromUserId toUserId");
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
      console.log(hideUsersFromFeed);
      const users = await User.find({
        $and: [
          { _id: { $nin: [...hideUsersFromFeed] } },
          { _id: { $ne: loggedInUser._id } },
        ],
      }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        message: 'Your Feed Data...!',
        users,
      })
    }
    catch(err) {
      req.status(400).send("ERROR: " + err.message);
    }
};

module.exports = {
    userRequestReceive,
    userConnections,
    userFeed,
}
  