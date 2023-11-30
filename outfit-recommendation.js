const backendServiceURL = "https://<your-backend-service-url>/analyze-image";

function analyzeImage() {
  const imageUrl = $('#image-url').val();

  fetch(backendServiceURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl })
  })
  .then(response => response.json())
  .then(recommendations => {
    $('#detected-items').empty();

    for (const recommendation of recommendations) {
      $('#detected-items').append('<li>' + recommendation + '</li>');
    }
  })
  .catch(error => {
    console.error(error);
  });
}

$(document).ready(function() {
  $('#upload-button').click(analyzeImage);
});
