from flask import Flask, request, jsonify
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import AnalyzeResults
from azure.identity import DefaultAzureCredential

app = Flask(__name__)

# Replace with your Computer Vision API key and endpoint
computer_vision_key = "889487a6c05140dea3f21658c7c1e2fe"
computer_vision_endpoint = "https://outfit-recommendation.cognitiveservices.azure.com/"

computer_vision_client = ComputerVisionClient(
    endpoint=computer_vision_endpoint,
    credentials=DefaultAzureCredential()
)

@app.route('/outfit-recommendation', methods=['POST'])
def outfitrecommendation():
    # Get the image URL from the request body
    image_data = request.get_json()
    image_url = image_data['image_url']

    # Analyze the image using Computer Vision API
    analyze_result = computer_vision_client.analyze_image(image_url)

    # Extract clothing items from the analysis results
    clothing_items = []
    for item in analyze_result.objects:
        if item.object_property == 'clothing':
            clothing_items.append(item.object_type)

    # Generate outfit recommendations based on the clothing items
    outfitrecommendation= []
    for item in clothing_items:
        # Replace with your outfit recommendation logic
        if item == 'shirt':
            if 'jeans' in clothing_items:
                outfitrecommendation.append('sneakers')
            else:
                outfitrecommendation.append('chinos')
        elif item == 'dress':
            outfitrecommendation.append('heels and a statement necklace')
        elif item == 'scarf':
             outfitrecommendation.append('plaid shirt and jeans')

    # Return the outfit recommendations
    return jsonify({'recommendations': outfitrecommendation})

if __name__ == '__main__':
    # Specify the port to run the server on
    app.run(host='localhost', port=5001, debug=True)
