# AI Instant Gift Finder

A single-page web application that suggests gifts based on the recipient's personality using the Gemini API.

## Features

- Input recipient details (name, age, gender, interests, occasion, budget)
- Get personalized gift suggestions using Google's Gemini AI
- Clean, responsive user interface
- No virtual environment required

## Requirements

- Python 3.7+
- Flask
- Google GenerativeAI Python SDK

## Setup Instructions

1. **Install required packages:**

```
pip install flask google-generativeai
```

2. **Get a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or sign in with your Google account
   - Generate an API key

3. **Update the API Key:**
   - Open `app.py`
   - Replace `YOUR_GEMINI_API_KEY` with your actual API key

4. **Run the application:**

```
python app.py
```

5. **Access the application:**
   - Open your browser and go to `http://127.0.0.1:5000`

## How It Works

1. User enters details about the gift recipient
2. The application sends this information to the Gemini API
3. Gemini generates personalized gift suggestions
4. The application displays these suggestions to the user

## Project Structure

- `app.py`: Flask backend with Gemini API integration
- `templates/index.html`: Main HTML template
- `static/css/style.css`: Styling for the application
- `static/js/script.js`: Frontend JavaScript for handling form submission and displaying results

## Notes

- This application requires an internet connection to communicate with the Gemini API
- The quality of gift suggestions depends on the details provided about the recipient