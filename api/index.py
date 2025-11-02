"""Vercel serverless function entry point for Proto-Gen API."""

import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

try:
    # Import the FastAPI app
    from main import app
except ImportError:
    # Fallback: create a simple FastAPI app
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(title="Proto-Gen API", version="1.0.0")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    async def root():
        return {"message": "Proto-Gen API is running on Vercel"}
    
    @app.get("/api/test")
    async def test():
        return {"message": "API test successful"}

# Export the app for Vercel
handler = app
