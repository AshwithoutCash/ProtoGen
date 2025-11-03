"""
Simple test server for inventory upload functionality.
Run this while debugging the main backend.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import io
from typing import Dict, Any

app = FastAPI(title="ProtoGen Test Server")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ProtoGen Test Server Running", "status": "ok"}

@app.post("/api/v1/upload-inventory")
async def upload_inventory(file: UploadFile = File(...)):
    """
    Test endpoint for inventory upload.
    Processes CSV and returns mock response.
    """
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Parse CSV
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Basic validation
        required_columns = ['ItemID', 'MaterialName', 'CurrentStock', 'MinimumStock']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {missing_columns}"
            )
        
        # Process data (mock Llama processing)
        processed_items = []
        for _, row in df.iterrows():
            item = {
                "ItemID": str(row.get('ItemID', '')),
                "MaterialName": str(row.get('MaterialName', '')),
                "Brand": str(row.get('Brand', 'Unknown')),
                "CurrentStock": float(row.get('CurrentStock', 0)),
                "Unit": str(row.get('Unit', 'units')),
                "Location": str(row.get('Location', 'Unknown')),
                "MinimumStock": float(row.get('MinimumStock', 0)),
                "Category": str(row.get('Category', 'General')),
                "ExpiryDate": str(row.get('ExpiryDate', '')),
                "CostPerUnit": float(row.get('CostPerUnit', 0)),
                "Supplier": str(row.get('Supplier', 'Unknown')),
                "Notes": str(row.get('Notes', ''))
            }
            processed_items.append(item)
        
        # Mock successful response
        response = {
            "success": True,
            "message": "Inventory processed successfully",
            "data": {
                "items_processed": len(processed_items),
                "processing_time": "2.3 seconds",
                "database_status": "uploaded to Firebase",
                "llama_processing": "completed",
                "items": processed_items
            }
        }
        
        return response
        
    except Exception as e:
        print(f"Error processing inventory: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/api/v1/inventory")
async def get_inventory():
    """Mock endpoint to get inventory data."""
    return {
        "success": True,
        "data": {
            "items": [
                {
                    "ItemID": "DEMO-001",
                    "MaterialName": "Q5 High-Fidelity DNA Polymerase",
                    "Brand": "New England Biolabs",
                    "CurrentStock": 25,
                    "Unit": "units",
                    "Location": "-20°C Freezer A, Rack 2",
                    "MinimumStock": 5,
                    "Category": "Enzymes"
                }
            ]
        }
    }

@app.post("/api/v1/inventory/search")
async def search_inventory(request: Dict[str, Any]):
    """Mock search endpoint."""
    return {
        "success": True,
        "data": {
            "items": []
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting ProtoGen Test Server...")
    print("Access at: http://localhost:8001")
    print("API Docs at: http://localhost:8001/docs")
    uvicorn.run(app, host="0.0.0.0", port=8001)
