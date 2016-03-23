/*
    This is the schema for a user account.
    It has methods for password creation, validation,
    encryption, and token creation.
*/

var mongoose = require('mongoose');
var crypto = require('crypto');

//Used to create a JWT token for the user.
var jwt = require('jsonwebtoken');

//The hash field holds the hashed password for the user.
var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function(password) {
  //Generate random salt.
  this.salt = crypto.randomBytes(16).toString('hex');
  
  //This function comes with Node's crypto module to hash passwords.
  //Encrypt user password.
  //This method takes four parameters: password, salt, iterations, and key length.
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  
  console.log("Password is valid: " + (this.hash == hash));
  
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  //set the token expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 2);
  
  //The first argument is the payload that gets signed.
  //Both server and client have access to the payload.
  
  //I should use an environment variable for referencing the secret
  //and keep it out of the codebase.
  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET_TUNNEL');
};

mongoose.model('User', UserSchema);
