import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("No GEMINI_API_KEY found in .env file")
    exit(1)

genai.configure(api_key=api_key)

print("Available models:")
for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"- {model.name}")

# Test with the first available model
try:
    models = [m for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
    if models:
        model_name = models[0].name
        print(f"\nTesting with model: {model_name}")
        
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello, how are you?")
        print(f"Response: {response.text}")
        print("\n✅ Gemini API is working!")
    else:
        print("No models support generateContent")
        
except Exception as e:
    print(f"Error: {e}")
