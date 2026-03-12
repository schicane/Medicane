from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import google.generativeai as genai
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key="YOUR_GEMINI_API_KEY")

class ImageRequest(BaseModel):
    image: str

@app.post("/extract")
async def extract_prescription(req: ImageRequest):
    try:
        image_data = req.image.split(",")[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([
            "You are a medical assistant. Extract the following details from this handwritten prescription image and return ONLY a JSON object with these keys: medication, dosage, frequency, doctor, date, notes. If a field is not found, set it to 'Not found'.",
            image
        ])

        import json, re
        text = response.text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {"error": "Could not parse prescription details"}

    except Exception as e:
        return {"error": str(e)}