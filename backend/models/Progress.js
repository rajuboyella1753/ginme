const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  month: { type: String, required: true },
  week: { type: String, required: true },
  total: { type: Number, required: true },
  completed: { type: Number, required: true },
  names: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
