from flask import Flask, request, jsonify, render_template
from openai import AzureOpenAI
import os

# Azure OpenAI credentials (replace with your own if not using environment variables)
AZURE_API_KEY = "5GEKdJykZlfJJ6uxXFA9QtKiwVXiCJm64ZaJE0wLAECvJQI2xgNoJQQJ99BGACfhMk5XJ3w3AAABACOGOXwd"
AZURE_ENDPOINT = "https://srtkbot-openai.openai.azure.com/"
AZURE_DEPLOYMENT_ID = "gpt-4o"
API_VERSION = "2023-12-01-preview"

# Initialize OpenAI client
client = AzureOpenAI(
    api_key=AZURE_API_KEY,
    azure_endpoint=AZURE_ENDPOINT,
    api_version=API_VERSION,
)

# Initialize Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")

# Serve main chat UI
@app.route('/')
def home():
    return render_template('index.html')

# Handle chatbot interaction
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    try:
        response = client.chat.completions.create(
            model=AZURE_DEPLOYMENT_ID,
            messages=[{"role": "user", "content": user_message}]
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({'response': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
