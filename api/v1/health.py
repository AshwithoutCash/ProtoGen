from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "available_providers": ["gemini"]
    }
