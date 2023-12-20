const express = require('express');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Replace with your Azure Cosmos DB connection string and database name
const cosmosDbConnectionString = 'mongodb://mydatabase01:WC2RfLypbFLOGm3HrUEgyuP67XV6zyCb14lauQx4liT9J9okSbUf27fF8fFyoe67QEAaJkSVIhoAACDb2sHLnA==@mydatabase01.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@mydatabase01@';
const dbName = 'mydatabase01';

// Replace with your Azure Storage account connection string
const storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=mystorageaccount3;AccountKey=z0YucsmH0lVBF5qdP4PzDuLGdT8mEzulNU86EyfcFxkdwXKuFsOhf0o+76y9DHVNX+Pu2PXiZ5ra+ASt9TKOsw==;EndpointSuffix=core.windows.net';

// Create a BlobServiceClient
const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);

// Get a reference to a container
const containerName = 'mystorage01';
const containerClient = blobServiceClient.getContainerClient(containerName);

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle image uploads
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Use containerClient to upload the image to Azure Storage
    const blobName = `image_${Date.now()}.jpg`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(req.file.buffer, req.file.buffer.length);

    // Insert document into MongoDB
    await insertDocument({
      imageUrl: blockBlobClient.url,  // Use the generated URL for the uploaded image
      uploadTimestamp: new Date(),
      // Add other relevant information or metadata
    });

    res.send('Image uploaded successfully!');
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// MongoDB functions
async function insertDocument(document) {
  let client;
  try {
    client = new MongoClient(cosmosDbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    const collection = db.collection('mydb01'); // Replace with your actual collection name

    const result = await collection.insertOne(document);
    
    console.log(`Document inserted with _id: ${result.insertedId}`);
  } catch (error) {
    console.error('Error inserting document:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}





































