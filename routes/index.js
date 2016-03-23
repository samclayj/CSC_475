//Handles the routing for models.
module.exports = function(router){

  var mongoose = require('mongoose');
  var passport = require('passport');
  var jwt = require('express-jwt');
  //var jwt = require('jsonwebtoken');


  var Post = mongoose.model('Post');
  var Comment = mongoose.model('Comment');
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
  router.get('/posts', function(req, res, next) {
    Post.find(function(err, posts){
      if(err) { 
         return next(err); 
      }
      res.json(posts);
    });
  });

  router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    
    //Set author field from the user
    post.author = req.payload.username;
    
    post.save(function(err, post){
      if(err){ return next(err); }

      res.json(post);
    });
  });
  
  //This method will be called by the get method
  //Using :post as a parameter.
  /*The Express param() function can be used to automatically load an object.
    This for this code to be reused in any call that needs a post with a specific
    id, which is common in most of these calls.*/
  router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
      if (err) { return next(err); }
      if (!post) { return next(new Error('can\'t find post')); }

      req.post = post;
      return next();
    });
  });
  
  //This will call the router.param('post') method first.
  //The results of this method called will be returned
  //to this one.
  router.get('/posts/:post', function(req, res) {
    
    //Populate will automatically load all the comments
    //associated with a particular post.
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
      });
  });
  
  //Handle upvoting for a particular post idea.
  router.put('/posts/:post/upvote', auth, function(req, res, next) {
    //Upvote is a method defined in the schema
    req.post.upvote(function(err, post) {
      if(err) { return next(err); }
      
      res.json(post);
    })
  });

  /*Create a new comment. Include the post ID, which is already included
    in the request. Attach a reference to this new comment to the 
    post object that it is a part of.*/
  router.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    
    //set comment author to the username
    comment.author = req.payload.username;
    
    comment.save(function(err, comment) {
      if(err) { return next(err); }
      
      //Attach this comment to the post.
      req.post.comments.push(comment);
      
      req.post.save(function(err, post) {
        if(err) { return next(err); }
        
        res.json(comment);
      });
    });
  });
  
  
 //This method will be called by the get method
  //Using :comment as a parameter.
  //I made this so it might not work.
  router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment){
      if (err) { return next(err); }
      if (!comment) { return next(new Error('can\'t find comment')); }

      req.comment = comment;
      return next();
    });
  });
  
  //Handle upvoting for a particular comment idea.
  router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    //Upvote is a method defined in the Comment Schema
    req.comment.upvote(function(err, comment) {
      if(err) { return next(err); }
      res.json(comment);
    })
  });
  
  // Handle User Authentication ============================
  
  //Register a new user (create instance of user schema)
  router.post('/register', function(req, res, next) {
    if(!req.body.username || !req.body.password) {
      return res.status(400).json({message: 'Please fill out all fields.'});
    }
    
    var user = new User();
    
    user.username = req.body.username;
    user.setPassword(req.body.password);
    
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
      return res.status(400).json({message: 'Please fill out all fields'});
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