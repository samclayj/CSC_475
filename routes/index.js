//Handles the routing for models.

module.exports = function(router){

  var mongoose = require('mongoose');
  var Post = mongoose.model('Post');
  var Comment = mongoose.model('Comment');

  router.get('/posts', function(req, res, next) {
    Post.find(function(err, posts){
      if(err) { 
         return next(err); 
      }
      res.json(posts);
    });
  });

  router.post('/posts', function(req, res, next) {
    var post = new Post(req.body);

    post.save(function(err, post){
      if(err){ return next(err); }

      res.json(post);
    });
  });
  
  router.get('/', function(req, res) {
    res.json({ message: 'hoooooray! welcome to our api!' });   
  });
  
}