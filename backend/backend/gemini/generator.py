from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

def generate_post(prompt: str) -> str:
    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents="Generate a post with a maximum of 3 sentences.Generate the text of the post immediately without the text to the text for the social network on the topic: " + prompt
    )
    return response.text
