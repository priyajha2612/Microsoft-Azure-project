async function uploadImage() {
    // Get the file input element
    var input = document.getElementById('imageInput');
    // Get the selected file
    var file = input.files[0];
  
    // Check if a file is selected
    if (!file) {
      alert('Please select an image.');
      return;
    }
  
    // Create a FormData object and append the image file
    var formData = new FormData();
    formData.append('image', file);
  
    // Azure Custom Vision API details
    var endpoint = 'https://myproject01-prediction.cognitiveservices.azure.com/';
    var apiKey = '656f1e49fb284d8596949a90542648d5';
    var iterationId = 'b018ff51-3862-4d1d-bb3a-ba8b5372d706';
    var projectId = '539219e2-8d65-4709-ba51-3a6e4b975e98';
    var apiUrl = `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${iterationId}/image`;
  
    try {
      // Show loading indicator or message
      // ...
  
      // Make a POST request to the Azure Custom Vision API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Prediction-Key': apiKey,
          // Allow the browser to set the Content-Type automatically for FormData
          // 'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response JSON
      const data = await response.json();
  
      // Handle the prediction results
      console.log(data);
  
      // Display results on the webpage
      document.getElementById('result').innerText = JSON.stringify(data, null, 2);
  
      // Hide loading indicator or message
      // ...
    } catch (error) {
      console.error('Error:', error);
  
      // Show error message to the user
      alert('Image upload failed. Please try again.');
  
      // Hide loading indicator or message
      // ...
    }
  }
  