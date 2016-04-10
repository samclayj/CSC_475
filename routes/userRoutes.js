//Handles the routing for Users.
module.exports = function(router){

  var mongoose = require('mongoose');
  var passport = require('passport');
  var jwt = require('express-jwt');

  var User = mongoose.model('User');
  
  // Middleware for authenticating jwt tokens
  //The user property option specifies which property on req to put our 
  //payload from our tokens. It's set on uesr by default, but we are using
  //payload to avoid conflicts with passport.
  //Don't hardcode the secret, use an environment variable.
  //This middleware lets you require authentication for specific routes.
  //Authenticate users when they try to write to the application (post/comment).
  //Auth is now a function defined in express-jwt to validate the token passed.
  //Note that this token MUST be passed as a header from the http request.
  var auth = jwt({secret: 'SECRET_TUNNEL', userProperty: 'payload'}); 
  
  
  /*Use express get() method to define the URL for the route and a function to handle the request.
    Inside the handler, query DB for posts. If an error occurs, pass the error to a function
    for handling this error. Otherwise, use res.json() to send the retrieved posts back to the client.*/

  //req stands for request. Contains all information about the request that was made to the server.
  //res stands for response. this is the object used to respond to the client.
  router.get('/users', function(req, res, next) {
    User.find(function(err, users){
      if(err) { 
         return next(err); 
      }
      res.json(users);
    });
  });
  
  /*The Express param() function can be used to automatically load an object.
  This for this code to be reused in any call that needs a post with a specific
  id, which is common in most of these calls.*/
  router.param('user', function(req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user){
      if (err) { return next(err); }
      if (!user) { return next(new Error('can\'t find user.')); }

      req.user = user;
      return next();
    });
  });
  
  router.get('/users/:user', function(req, res) {
    res.json(req.user);
  });
  
  router.post('/users/update/:user', function(req, res, next) {
    if(!req.body.username || !req.body.firstName || !req.body.lastName) {
      return res.status(400).json({message: 'Please fill out all fields.'});
    }
    
    var user = req.user;
    
    user.username = req.body.username;
    
    if(req.body.password) {
        user.setPassword(req.body.password);
    }
    
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.accountType = req.body.accountType;
    
    user.save(function(err, user) {
      if(err) { return next(err); }
      res.send(user);
    });
  });
  
  router.post('/users/delete/:user', function(req, res, next) {
    var user = req.user;
    var query = User.findById(user._id);
    query.remove().exec();
  });
  
  // Handle User Authentication ============================
  
  //Register a new user (create instance of user schema)
  router.post('/register', function(req, res, next) {
    if(!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
      return res.status(400).json({message: 'Please fill out all fields.'});
    }
        
    var user = new User();

    user.username = req.body.username;
    user.setPassword(req.body.password);
    
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.accountType = req.body.accountType;
    
    user.save(function (err) {
      if(err) { return next(err); }
      
      return res.json({token: user.generateJWT()});
    })
  });
  
  //Login the user.
  //passport.authenticate('local') uses the LocalStrategy defined in
  // /config/passport.js. This uses a custom callback for the authenticate
  //middleware so custom error messages can be returned to the client.
  //Successful authentication means we should return a JWT token to the client.
  router.post('/login', function(req, res, next) {
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields.'});
    }

    passport.authenticate('local', function(err, user, info){
      if(err){ return next(err); }

      if(user){
        return res.json({token: user.generateJWT()});
      } else {
        return res.status(401).json(info);
      }
    })(req, res, next);
  });
  
}