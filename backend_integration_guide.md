# Procurement Backend Integration Guide
## Ollama + Gemini Processing Pipeline

This guide explains how to set up the backend to handle procurement requests using Ollama as the processing agent and Gemini for search processing.

## Architecture Flow

```
Frontend → Ollama Agent → Gemini Search → Ollama Processing → Frontend
```

## API Endpoint Requirements

### Endpoint: `POST /api/v1/generate-procurement`

### Request Headers
```
Content-Type: application/json
X-Processing-Agent: ollama
X-LLM-Backend: gemini
X-Task-Type: procurement-search
```

### Request Body Structure
```json
{
  "materials_list": "Q5 Polymerase\ndNTP Mix\nPCR Tubes",
  "quantities": "50 units\n1 mL\n500 tubes",
  "preferred_brands": "Q5 Polymerase: New England Biolabs\ndNTP Mix: Thermo Fisher",
  "budget_limit": "$500",
  "urgency": "standard",
  "supplier_preference": "any",
  "processing_pipeline": {
    "agent": "ollama",
    "llm_backend": "gemini",
    "task_type": "procurement_search",
    "search_providers": ["sigma-aldrich", "thermo-fisher", "bio-rad", "neb"],
    "response_format": "structured_procurement_data"
  }
}
```

## Expected Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "name": "Q5 Polymerase",
        "quantity": "50 units",
        "vendors": [
          {
            "vendor_name": "New England Biolabs",
            "product_id": "M0491S",
            "price": "$156.00",
            "size": "50 units",
            "link": "https://www.neb.com/products/m0491-q5-high-fidelity-dna-polymerase",
            "is_preferred": true
          },
          {
            "vendor_name": "Thermo Fisher Scientific",
            "product_id": "F530S",
            "price": "$145.00",
            "size": "50 units", 
            "link": "https://www.thermofisher.com/order/catalog/product/F530S",
            "is_preferred": false
          }
        ],
        "summary": "Found 2 suppliers for Q5 Polymerase. Preferred vendor (NEB) available."
      }
    ],
    "preferred_brands": "Q5 Polymerase: New England Biolabs, dNTP Mix: Thermo Fisher",
    "total_cost": {
      "preferred": "$287.50",
      "lowest": "$265.00", 
      "savings": "$22.50"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

## Ollama Processing Steps

### 1. Ollama Agent Receives Request
- Parse materials list and quantities
- Extract preferred brands and constraints
- Prepare search queries for Gemini

### 2. Ollama → Gemini Search Processing
```python
# Example Ollama prompt to Gemini
prompt = f"""
Search for laboratory reagent pricing for the following materials:
Materials: {materials_list}
Quantities: {quantities}
Preferred Brands: {preferred_brands}
Budget Limit: {budget_limit}

Search the following suppliers:
- Sigma-Aldrich
- Thermo Fisher Scientific  
- Bio-Rad
- New England Biolabs

For each material, find:
1. Product name and ID
2. Price per unit/size
3. Vendor information
4. Direct product links
5. Availability status

Prioritize preferred brands when specified.
Return structured data in JSON format.
"""
```

### 3. Gemini Processes Search
- Performs web searches across supplier sites
- Extracts pricing and product information
- Compares vendors and identifies preferred options
- Returns structured search results

### 4. Ollama Post-Processing
- Validates Gemini search results
- Formats data according to frontend requirements
- Calculates cost summaries and savings
- Applies business logic (preferred brands, budget constraints)
- Returns final structured response

## Implementation Suggestions

### Backend Framework (Python/FastAPI)
```python
from fastapi import FastAPI, Header
import ollama
import google.generativeai as genai

app = FastAPI()

@app.post("/api/v1/generate-procurement")
async def generate_procurement(
    request: ProcurementRequest,
    x_processing_agent: str = Header(None),
    x_llm_backend: str = Header(None)
):
    # 1. Validate headers
    if x_processing_agent != "ollama":
        raise HTTPException(400, "Invalid processing agent")
    
    # 2. Send to Ollama
    ollama_response = await ollama.chat(
        model="llama2",  # or your preferred model
        messages=[{
            "role": "system", 
            "content": "You are a lab procurement assistant..."
        }, {
            "role": "user",
            "content": format_procurement_prompt(request)
        }]
    )
    
    # 3. Ollama processes with Gemini
    gemini_search_results = await process_with_gemini(
        ollama_response, request.processing_pipeline
    )
    
    # 4. Return processed results
    return format_procurement_response(gemini_search_results)
```

## Testing the Integration

1. **Start Ollama service**
2. **Configure Gemini API access**  
3. **Test the endpoint** with sample data
4. **Verify response format** matches frontend expectations

## Error Handling

The frontend handles these specific error cases:
- **404**: Ollama agent not available
- **500**: Internal processing error
- **Network**: Connection issues
- **Validation**: Invalid response format

Make sure your backend returns appropriate HTTP status codes and error messages.
