const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB Connection
const mongoDbUrl = 'mongodb://mydatabase01:WC2RfLypbFLOGm3HrUEgyuP67XV6zyCb14lauQx4liT9J9okSbUf27fF8fFyoe67QEAaJkSVIhoAACDb2sHLnA==@mydatabase01.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@mydatabase01@';
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Custom Vision API Configuration
const customVisionApiUrl = 'https://myproject01-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/539219e2-8d65-4709-ba51-3a6e4b975e98/classify/iterations/Iteration1/image';
const predictionKey = '2dbca35027b34f81905d0d0241f3746c';

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define MongoDB schema
const ImageSchema = new mongoose.Schema({
  imageUrl: String,
  tags: [String],
});

const ImageModel = mongoose.model('Image', ImageSchema);

// Express route for image upload and prediction
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Use Custom Vision API for image predictions
    const formData = new FormData();
    formData.append('image', req.file.buffer);

    const response = await fetch(customVisionApiUrl, {
      method: 'POST',
      headers: {
        'Prediction-Key': predictionKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const predictions = data.predictions;

    // Store predictions in MongoDB
    const imageDocument = new ImageModel({
      imageUrl: 'https://example.com/image.jpg', // Replace with the actual URL
      tags: predictions.map(prediction => prediction.tagName),
    });

    await imageDocument.save();

    res.send('Image uploaded and predictions stored successfully!');
  } catch (error) {
    console.error('Error processing and storing predictions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Express route for displaying similar images
app.get('/similarImages/:imageId', async (req, res) => {
  try {
    const imageId = req.params.imageId;

    // Retrieve tags of the given image from MongoDB
    const image = await ImageModel.findById(imageId);

    if (!image) {
      res.status(404).send('Image not found');
      return;
    }

    // Use the tags to find similar images
    const similarImages = await ImageModel.find({ tags: { $in: image.tags } })
      .where('_id')
      .ne(imageId)
      .limit(5) // Adjust the number of similar images to display
      .exec();

    res.json(similarImages);
  } catch (error) {
    console.error('Error retrieving similar images:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
