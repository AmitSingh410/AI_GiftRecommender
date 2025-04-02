from flask import Flask, render_template, request, jsonify
import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
# Note: You'll need to replace this with your actual API key
API_KEY = "pAIzaSyCUIXdoqeznuryXMgVM1vcBMopqTzmwbS4"
os.environ['GOOGLE_API_KEY'] = API_KEY
genai.configure(api_key=API_KEY)

# Set up the model
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/saved')
def saved_suggestions():
    return render_template('saved_suggestions.html')

@app.route('/get_gift_suggestions', methods=['POST'])
def get_gift_suggestions():
    try:
        data = request.get_json()
        
        # Extract form data
        name = data.get('name', '')
        age = data.get('age', '')
        gender = data.get('gender', '')
        interests = data.get('interests', '')
        occasion = data.get('occasion', '')
        budget = data.get('budget', '')
        
        # Create the prompt for Gemini API
        prompt = f"""Suggest 5 gift ideas for a {age} year old {gender} named {name} 
        who is interested in {interests}. The occasion is {occasion} and the budget is {budget}. 
        For each gift suggestion, provide:
        1. Gift name
        2. Brief description
        3. Estimated price
        4. Where to buy it
        5. Why it matches their personality
        
        Format the response as a JSON array of gift objects.
        """
        
        # Generate content using Gemini API
        response = model.generate_content(prompt)
        
        # Process the response to extract gift suggestions
        # Note: This assumes Gemini returns properly formatted JSON
        # You might need to parse the text response in a real implementation
        response_text = response.text
        
        # Try to extract JSON from the response
        try:
            # Look for JSON in the response
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                gift_suggestions = json.loads(json_str)
            else:
                # If no JSON format is found, create a structured response
                gift_suggestions = [{"error": "Could not parse JSON from response", "raw_response": response_text}]
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw text
            gift_suggestions = [{"error": "Invalid JSON in response", "raw_response": response_text}]
        
        return jsonify({
            'success': True,
            'suggestions': gift_suggestions
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)