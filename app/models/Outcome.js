var mongoose = require('mongoose');

var OutcomeSchema = new mongoose.Schema({
  name: String,
  description: String,
  term: String,
  objective: { type: mongoose.Schema.Types.ObjectId, ref: 'Objective' },
  assessmentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentMethod' }]
});

mongoose.model('Outcome', OutcomeSchema);