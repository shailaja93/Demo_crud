/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
var async = require('async');
var _ = require('lodash');
module.exports = {
/**
* Sign up in system
* @param {Object} req Request object
* @param {Object} res Response object
*/
  signup: function (req, res) {

  var params = req.params.all();
  if(params.username == undefined || params.username == '')
  {
  	return res.badRequest({
  		custom_message : 'Username is Required!',
  		data : []
  	})
  }
  
  if(params.password == undefined || params.password == '')
  {
  	return res.badRequest({
  		custom_message : 'Password is Required!',
  		data : []
  	})
  }

  User.find({username : params.username}).exec(function(err,userfound){
  	if(err)
  	{
  		return res.serverError({
  			custom_message : 'Server Error',
  			data : err
  		})
  	}
  	else if(userfound.length != 0)
  	{
  		return res.ok({
  			custom_message : 'Email already exists!',
  			data : []
  		})
  	}
  	else
  	{
  		var data = {
  			username : params.username,
  			password : params.password
  		}
  		User.create(data).exec(function(err,usercreated){
  			if(err)
  			{
  				return res.serverError({
		  			custom_message : 'Server Error',
		  			data : err
		  		})
  			}
  			else
  			{
  				return res.ok({
  					custom_message : 'Successfully Created!',
  					data : usercreated.username,
  					token: CipherService.createToken(usercreated.id)
  				})
  			}
  		})
  	}
  })
  },
 
/**
* Sign in by local strategy in passport
* @param {Object} req Request object
* @param {Object} res Response object
*/
  signin: function (req, res) {
    passport.authenticate('local', 
      function (error, user, info) {
      if (error) {
      	return res.serverError({
		  			custom_message : 'Server Error',
		  			data : err
		  		})
      }
      if (!user) 
      {
      	return res.ok({
      		custom_message : 'Invalid Credentials',
      		data : []
      	})
      }
      
      return res.ok({
	    custom_message : "Successfully logged In",
	    token: CipherService.createToken(user.id),
	    user: user
	  });
    })(req, res);
  },

  get_friends: function(req,res) {
    var id = req.user.id;

    Friends.find({uid : req.user.id},{select : ['fid']}).exec(function(err,userfriends){
      if(err)
      {
        return res.serverError({
            custom_message : 'Server Error',
            data : err
          })
      }
      else
      {
         async.eachSeries(userfriends, function(current_friend, callback_match_friend) {                    // clubactivities find starts
           
                   User.find({
                     id: current_friend.fid
                   }).exec(function(err, matched_user){
                   
                   if (err) {
                       return res.serverError({
                           success:false,
                           custom_message:err,
                       })
                   }                        
                   else
                   {
                      current_friend.id = matched_user[0].id;
                      current_friend.username = matched_user[0].username; 
                   }    
                    callback_match_friend();
                  });
                 } , function () {
                     
                      return res.ok({
                        custom_message:"Friends displayed successfully",
                        friends:userfriends
                      });   
          });
      }
    })
  },

  add_friends: function(req,res) {
    var params = req.params.all();

    if(params.fid == undefined || params.fid == "")
    {
      return res.badRequest({
          custom_message : 'Friend Id is Required!',
          data : []
        })
    }
    var data = {
      uid : req.user.id,
      fid : params.fid
    }

    Friends.create(data).exec(function(error,friendcreated){
      if(error){
        return res.serverError({
            custom_message : 'Server Error',
            data : err
          })
      }
      else
      {
        return res.ok({
          custom_message : 'Successfully Friend Added!',
          data : friendcreated
        })
      }
    })
  },

  delete_friend : function(req,res) {
    var params = req.params.all();
   
    if(params.fid == undefined || params.fid == "")
    {
      return res.badRequest({
          custom_message : 'Friend Id is Required!',
          data : []
        })
    }

    Friends.query('DELETE FROM friends WHERE fid=' + params.fid + ' AND uid=' + req.user.id + '',function(error,frienddeleted){
      if(error){
        return res.serverError({
            custom_message : 'Server Error',
            data : error
          })
      }
      else
      {
        return res.ok({
          custom_message : 'Successfully Friend Deleted!',
          data : []
        })
      }
    })
  },

  change_password : function(req,res) {
    var params = req.params.all();

    if(params.old_password == undefined)
    {
      return res.badRequest({
          custom_message : 'Old Password is Required!',
          data : []
        })
    }

    if(params.new_password == undefined)
    {
      return res.badRequest({
          custom_message : 'New Password is Required!',
          data : []
        })
    }
    
    User.find({id : req.user.id},{select : ['password']}).exec(function(error,userfound){
      if(error)
      {
        return res.serverError({
            custom_message : 'Server Error',
            data : error
          })
      }
      else
      {
        if (!CipherService.comparePassword(params.old_password, userfound[0]))
        {
          return res.ok({
            custom_message : 'Old Password is Incorrect!',
            data : []
          })
        }
        else
        {
          User.update({id : req.user.id},{password : params.new_password})
          .exec(function(error,userupadated){
            if(error)
            {
              return res.serverError({
                  custom_message : 'Server Error',
                  data : error
                })
            }
            else
            {
              return res.ok({
                custom_message : 'Successfully Changed the Passwword',
                data : []
              })
            }
          })
        }
      }
    })
  },

  list_users : function(req,res) {

    User.query('SELECT * from user ORDER BY username DESC',function(error,userslist){
      if(error)
      {
        return res.serverError({
                  custom_message : 'Server Error',
                  data : error
                })
      }
      else
      {

        return res.ok({
                custom_message : 'Successfully listed the users!',
                data : _.map(userslist, function(o) { return _.omit(o, 'password'); })
              })
      }
    })
  }

};

