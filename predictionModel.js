// predictionModel.js

const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  predictedTags: { type: [String], required: true },
  timestamp: { type: Date, default: Date.now },
});

const PredictionModel = mongoose.model('Prediction', predictionSchema);

module.exports = PredictionModel;
