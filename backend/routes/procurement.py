from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import asyncio
import httpx
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class ProcurementRequest(BaseModel):
    materials_list: str
    quantities: str
    preferred_brands: Optional[str] = ""
    budget_limit: Optional[str] = ""
    urgency: str = "standard"
    supplier_preference: str = "any"
    processing_pipeline: Dict[str, Any]

class ProcurementResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Ollama configuration
OLLAMA_BASE_URL = "http://localhost:11434"
GEMINI_API_KEY = "your-gemini-api-key"  # Replace with actual API key

async def call_ollama(prompt: str, model: str = "llama2") -> str:
    """Call Ollama API for processing"""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 2000
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "")
            else:
                logger.error(f"Ollama API error: {response.status_code}")
                return ""
                
    except Exception as e:
        logger.error(f"Error calling Ollama: {str(e)}")
        return ""

async def search_with_gemini(materials: List[str], preferred_brands: Dict[str, str]) -> Dict[str, Any]:
    """Use Gemini to search for procurement data"""
    try:
        # This would be the actual Gemini API call
        # For now, we'll simulate the search results
        
        search_prompt = f"""
        Search for laboratory reagent pricing and availability for these materials:
        Materials: {', '.join(materials)}
        Preferred Brands: {json.dumps(preferred_brands)}
        
        Search the following suppliers:
        - Sigma-Aldrich (sigma-aldrich.com)
        - Thermo Fisher Scientific (thermofisher.com)
        - Bio-Rad (bio-rad.com)
        - New England Biolabs (neb.com)
        
        For each material, find:
        1. Product name and catalog number
        2. Price per unit/size
        3. Vendor information
        4. Direct product links
        5. Availability status
        
        Return results in JSON format with vendor comparisons.
        """
        
        # Simulate Gemini search results
        await asyncio.sleep(2)  # Simulate search time
        
        search_results = {}
        for material in materials:
            material_key = material.lower()
            vendors = []
            
            # Simulate vendor-specific results based on material type
            if "polymerase" in material_key or "enzyme" in material_key:
                vendors.extend([
                    {
                        "vendor_name": "New England Biolabs",
                        "product_id": f"M{hash(material) % 1000}S",
                        "price": f"${150 + (hash(material) % 100):.2f}",
                        "size": "50 units",
                        "link": f"https://www.neb.com/products/{material.lower().replace(' ', '-')}",
                        "availability": "In Stock",
                        "is_preferred": preferred_brands.get(material_key) == "New England Biolabs"
                    }
                ])
            
            # Always include Sigma-Aldrich and Thermo Fisher
            vendors.extend([
                {
                    "vendor_name": "Sigma-Aldrich",
                    "product_id": f"S{hash(material + 'sigma') % 10000}",
                    "price": f"${100 + (hash(material) % 80):.2f}",
                    "size": "Standard",
                    "link": f"https://www.sigmaaldrich.com/catalog/search?term={material.replace(' ', '%20')}",
                    "availability": "In Stock",
                    "is_preferred": preferred_brands.get(material_key) == "Sigma-Aldrich"
                },
                {
                    "vendor_name": "Thermo Fisher Scientific",
                    "product_id": f"TF{hash(material + 'thermo') % 10000}",
                    "price": f"${120 + (hash(material) % 90):.2f}",
                    "size": "Standard",
                    "link": f"https://www.thermofisher.com/search/results?query={material.replace(' ', '+')}",
                    "availability": "In Stock",
                    "is_preferred": preferred_brands.get(material_key) == "Thermo Fisher"
                }
            ])
            
            if "agarose" in material_key or "gel" in material_key:
                vendors.append({
                    "vendor_name": "Bio-Rad",
                    "product_id": f"BR{hash(material + 'biorad') % 1000}",
                    "price": f"${80 + (hash(material) % 60):.2f}",
                    "size": "Standard",
                    "link": f"https://www.bio-rad.com/en-us/category/electrophoresis?N={material.replace(' ', '+')}",
                    "availability": "In Stock",
                    "is_preferred": preferred_brands.get(material_key) == "Bio-Rad"
                })
            
            search_results[material] = vendors
            
        return search_results
        
    except Exception as e:
        logger.error(f"Error in Gemini search: {str(e)}")
        return {}

@router.post("/generate-procurement", response_model=ProcurementResponse)
async def generate_procurement(
    request: ProcurementRequest,
    x_processing_agent: Optional[str] = Header(None),
    x_llm_backend: Optional[str] = Header(None),
    x_task_type: Optional[str] = Header(None)
):
    """
    Generate procurement analysis using Ollama + Gemini pipeline
    """
    try:
        logger.info(f"Received procurement request with agent: {x_processing_agent}, backend: {x_llm_backend}")
        
        # Validate headers
        if x_processing_agent != "ollama":
            raise HTTPException(status_code=400, detail="Invalid processing agent. Expected 'ollama'")
        
        if x_llm_backend != "gemini":
            raise HTTPException(status_code=400, detail="Invalid LLM backend. Expected 'gemini'")
        
        # Parse input data
        materials = [m.strip() for m in request.materials_list.split('\n') if m.strip()]
        quantities = [q.strip() for q in request.quantities.split('\n') if q.strip()]
        
        # Parse preferred brands
        preferred_brands = {}
        if request.preferred_brands:
            for line in request.preferred_brands.split('\n'):
                if ':' in line:
                    material, brand = line.split(':', 1)
                    preferred_brands[material.strip().lower()] = brand.strip()
        
        logger.info(f"Processing {len(materials)} materials with Ollama agent")
        
        # Step 1: Ollama processes the request and prepares search queries
        ollama_prompt = f"""
        You are a laboratory procurement assistant. Process this procurement request:
        
        Materials needed: {materials}
        Quantities: {quantities}
        Preferred brands: {preferred_brands}
        Budget limit: {request.budget_limit}
        Urgency: {request.urgency}
        
        Prepare structured search queries for each material to find the best suppliers.
        Focus on scientific accuracy and cost-effectiveness.
        Consider preferred brands when specified.
        
        Return a brief analysis of the procurement requirements.
        """
        
        ollama_analysis = await call_ollama(ollama_prompt)
        logger.info(f"Ollama analysis complete: {len(ollama_analysis)} characters")
        
        # Step 2: Use Gemini for supplier search
        logger.info("Initiating Gemini search for supplier data")
        gemini_results = await search_with_gemini(materials, preferred_brands)
        
        # Step 3: Ollama post-processes Gemini results
        post_process_prompt = f"""
        Process these supplier search results and format them for procurement analysis:
        
        Search Results: {json.dumps(gemini_results, indent=2)}
        Preferred Brands: {preferred_brands}
        Budget Limit: {request.budget_limit}
        
        Analyze the results and provide:
        1. Best vendor recommendations for each material
        2. Cost analysis and potential savings
        3. Preferred brand availability
        4. Overall procurement strategy
        
        Focus on practical recommendations for laboratory purchasing.
        """
        
        final_analysis = await call_ollama(post_process_prompt)
        
        # Step 4: Format response for frontend
        processed_materials = []
        total_preferred_cost = 0
        total_lowest_cost = 0
        
        for i, material in enumerate(materials):
            quantity = quantities[i] if i < len(quantities) else "1 unit"
            vendors = gemini_results.get(material, [])
            
            # Sort vendors: preferred first, then by price
            vendors.sort(key=lambda v: (not v.get('is_preferred', False), 
                                      float(v.get('price', '$0').replace('$', ''))))
            
            # Calculate costs
            if vendors:
                preferred_vendor = next((v for v in vendors if v.get('is_preferred')), vendors[0])
                lowest_vendor = min(vendors, key=lambda v: float(v.get('price', '$0').replace('$', '')))
                
                total_preferred_cost += float(preferred_vendor.get('price', '$0').replace('$', ''))
                total_lowest_cost += float(lowest_vendor.get('price', '$0').replace('$', ''))
            
            processed_materials.append({
                "name": material,
                "quantity": quantity,
                "vendors": vendors[:3],  # Top 3 vendors
                "summary": f"Found {len(vendors)} suppliers. " + 
                          ("Preferred vendor available." if any(v.get('is_preferred') for v in vendors) 
                           else "No preferred vendor specified.")
            })
        
        # Prepare final response
        response_data = {
            "materials": processed_materials,
            "preferred_brands": request.preferred_brands or "Processed by Ollama agent with Gemini search",
            "total_cost": {
                "preferred": f"${total_preferred_cost:.2f}",
                "lowest": f"${total_lowest_cost:.2f}",
                "savings": f"${abs(total_preferred_cost - total_lowest_cost):.2f}"
            },
            "processing_info": {
                "agent": "ollama",
                "llm_backend": "gemini",
                "search_providers_used": ["sigma-aldrich", "thermo-fisher", "bio-rad", "neb"],
                "processing_time": "Real-time",
                "analysis": ollama_analysis[:200] + "..." if len(ollama_analysis) > 200 else ollama_analysis
            },
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Procurement analysis complete for {len(materials)} materials")
        
        return ProcurementResponse(
            success=True,
            data=response_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in procurement generation: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error in Ollama/Gemini pipeline: {str(e)}"
        )
