const mongoose = require('mongoose');

const todoUserSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,  // ❌ No `unique: true` here!
  }
});

const TODOuserTask = mongoose.model("TODOschema", todoUserSchema);

module.exports = TODOuserTask;
