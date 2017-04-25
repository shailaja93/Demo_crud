/**
 * isAuthenticated
 * @description :: Policy to inject user in req via JSON Web Token
 */
var passport = require('passport');
 
module.exports = function (req, res, next) {
	console.log('isAuthenticated');
    passport.authenticate('jwt', function (error, user, info) {
      if (error) 
      {
      	return res.serverError({
		  			custom_message : 'Server Error',
		  			data : error
		  		})
      }
      if (!user) 
      {
        console.log("INFO",info);
      	return res.ok({
      		custom_message : 'Invalid Token',
      		data : []
      	})
      }
     req.user = user;
 
     next();
    })(req, res);
};