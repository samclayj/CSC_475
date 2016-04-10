var mongoose = require('mongoose');

var ObjectiveSchema = new mongoose.Schema({
  name: String,
  description: String,
  outcomes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outcome' }]
});

mongoose.model('Objective', ObjectiveSchema);