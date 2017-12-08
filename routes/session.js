//just to return to the frontend user values stored in session variables
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
	res.statusCode = 200;
  	res.setHeader("Content-Type", "application/json");
  	var user = req.session.passport.user;
  	if(!user)
  		user = 'false';
	res.json(user);
});

module.exports = router;