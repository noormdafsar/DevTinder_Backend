const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');


const { profileView, profileEdit, deleteProfile } = require('../controllers/Profile');

router.get('/view', userAuth, profileView);
router.patch('/edit', userAuth, profileEdit);
router.delete('/delete', deleteProfile);


module.exports = router;