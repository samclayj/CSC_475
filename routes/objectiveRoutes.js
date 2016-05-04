 //Handles the routing for Users.
module.exports = function(router){

  var mongoose = require('mongoose');
  var passport = require('passport');
  var jwt = require('express-jwt');

  var Objective = mongoose.model('Objective');
  var Outcome = mongoose.model('Outcome');
  
  
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

  router.post('/objectives', auth, function(req, res, next) {
    var objective = new Objective(req.body);
    
    objective.save(function(err, objective){
      if(err){ return next(err); }

      res.json(objective);
    });
  });
  
  //req stands for request. Contains all information about the request that was made to the server.
  //res stands for response. this is the object used to respond to the client.
  router.get('/objectives', function(req, res, next) {
    Objective.find(function(err, objectives){
      if(err) { 
         return next(err); 
      }
      res.json(objectives);
    });
  });
  
  /*The Express param() function can be used to automatically load an object.
  This for this code to be reused in any call that needs a post with a specific
  id, which is common in most of these calls.*/
  router.param('objective', function(req, res, next, id) {
    var query = Objective.findById(id);

    query.exec(function (err, objective){
      if (err) { return next(err); }
      if (!objective) { return next(new Error('can\'t find objective.')); }

      req.objective = objective;
      return next();
    });
  });
  
  router.get('/objectives/:objective', function(req, res) {
    //Populate will automatically load all the outcomes
    //associated with a particular objective.
    req.objective.populate('outcomes', function(err, objective) {
        if (err) { return next(err); }

        res.json(objective);
      });
  });
  
  router.post('/objectives/update/:objective', function(req, res, next) {
    if(!req.body.name || !req.body.description) {
      return res.status(400).json({message: 'Please fill out all fields.'});
    }
    
    var objective = req.objective;
    objective.name = req.body.name;
    objective.description = req.body.description;
    objective.outcomes = req.body.outcomes;
    
    objective.save(function(err, objective) {
      if(err) { return next(err); }
      res.send(objective);
    });
  });
  
  router.post('/objectives/delete/:objective', function(req, res, next) {
    var objective = req.objective;
    var query = Objective.findById(objective._id);
    query.remove().exec();
  });
  
  
  //Handle Outcomes=======================================================
  router.post('/objectives/:objective/outcomes', auth, function(req, res, next) {
    var outcome = new Outcome(req.body);
    outcome.objective = req.objective;
    
    outcome.save(function(err, outcome) {
      if(err) { return next(err); }
      
      //Attach this comment to the post.
      req.objective.outcomes.push(outcome);
      
      req.objective.save(function(err, objective) {
        if(err) { return next(err); }
        
        res.json(outcome);
      });
    });
    
  });
  
  router.param('outcome', function(req, res, next, id) {
    var query = Outcome.findById(id);

    query.exec(function (err, outcome){
      if (err) { return next(err); }
      if (!outcome) { return next(new Error('can\'t find outcome.')); }

      req.outcome = outcome;
      return next();
    });
  });
  
  
  router.post('/outcomes/delete/:outcome', function(req, res, next) {
    var outcome = req.outcome;
    var query = Outcome.findById(outcome._id);
    
    query.remove().exec();
  });
}