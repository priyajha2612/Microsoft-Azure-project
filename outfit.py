import requests

subscription_key = '889487a6c05140dea3f21658c7c1e2fe'
endpoint = 'https://outfit-recommendation.cognitiveservices.azure.com/'

image_url = 'https://tse1.mm.bing.net/th?id=OIP.Zd7JpdrBXAihz5L5NV4vZwHaJM&pid=Api&P=0&h=180'
analyze_url = f'{endpoint}/vision/v3.2/analyze'

headers = {'Ocp-Apim-Subscription-Key': subscription_key}
params = {'visualFeatures': 'Categories,Description,Color'}
data = {'url': image_url}

response = requests.post(analyze_url, headers=headers, params=params, json=data)
result = response.json()

print(result)
