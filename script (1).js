function uploadImage() {
  var input = document.getElementById('imageInput');
  var file = input.files[0];

  var formData = new FormData();
  formData.append('image', file);

  var endpoint = 'https://outfitrecommendation.cognitiveservices.azure.com/';
  var apiKey = '464d36c302c24507a131695cca74dac4';
  var iterationId = '8a74d741-a4fa-401d-8172-8e0528c38d4d';

  var apiUrl = endpoint + '/predict?iterationId=8a74d741-a4fa-401d-8172-8e0528c38d4d';

  fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Prediction-Key': apiKey,
          'Content-Type': 'multipart/form-data'
      },
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      // Handle the prediction results
      console.log(data);
      document.getElementById('result').innerText = JSON.stringify(data, null, 2);
  })
  .catch(error => {
      console.error('Error:', error);
  });



 

}
