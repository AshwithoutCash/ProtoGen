"""API routes for Proto-Gen."""

from fastapi import APIRouter, HTTPException, Header, UploadFile, File
from typing import Optional
from app.models.protocol import (
    ProtocolGenerationRequest,
    TroubleshootingRequest,
    ProtocolResponse,
    RouteGenRequest,
    RouteGenResponse,
    ToolGenRequest,
    ToolGenResponse,
    HealthResponse,
    ProcurementRequest,
    ProcurementResponse,
    InventoryUploadResponse,
    InventoryResponse,
    InventorySearchRequest,
    InventoryAvailabilityRequest
)
from app.services.protocol_service import protocol_service
from app.services.local_ai_service import local_ai_service
from app.services.llm_service import llm_service
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    # Check if local AI stack is available
    local_ai_health = local_ai_service.get_health_status()
    
    if local_ai_health.get("overall", False):
        return HealthResponse(
            status="healthy",
            version=settings.app_version,
            available_providers=["local_ai_stack"]
        )
    else:
        return HealthResponse(
            status="healthy",
            version=settings.app_version,
            available_providers=["gemini", "openai", "anthropic"],
            message="Local AI stack not available. Using external APIs."
        )


@router.post("/generate", response_model=ProtocolResponse)
async def generate_protocol(request: ProtocolGenerationRequest):
    """
    Generate a laboratory protocol based on user input.
    
    Args:
        request: Protocol generation request with experimental details
        
    Returns:
        Generated protocol in Markdown format
    """
    try:
        response = await protocol_service.generate_protocol(request)
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/troubleshoot", response_model=ProtocolResponse)
async def troubleshoot_protocol(request: TroubleshootingRequest):
    """
    Troubleshoot a failed protocol and provide suggestions.
    
    Args:
        request: Troubleshooting request with problem description and original protocol
        
    Returns:
        Troubleshooting analysis with ranked causes and solutions
    """
    try:
        response = await protocol_service.troubleshoot_protocol(request)
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/techniques")
async def get_techniques():
    """Get list of supported techniques."""
    from app.models.protocol import TechniqueType
    
    return {
        "techniques": [
            {"value": technique.value, "label": technique.value}
            for technique in TechniqueType
        ]
    }


@router.post("/routes", response_model=RouteGenResponse)
async def generate_routes(request: RouteGenRequest):
    """
    Generate experimental routes for a complex scientific goal.
    
    This endpoint analyzes a complex scientific objective and provides
    2-3 distinct experimental routes with step-by-step workflows,
    comparative analysis, and direct links to protocol generation.
    
    Args:
        request: Route generation request with goal, materials, and constraints
        
    Returns:
        Multiple experimental routes with pros/cons and next steps
    """
    try:
        response = await protocol_service.generate_routes(request)
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tools", response_model=ToolGenResponse)
async def generate_tools(request: ToolGenRequest):
    """
    Generate computational tool recommendations for a specific task.
    
    This endpoint analyzes a computational biology task and provides
    targeted software recommendations with step-by-step usage guides
    and video tutorials.
    
    Args:
        request: Tool generation request with goal, technique, and data type
        
    Returns:
        Tool recommendations with usage instructions and tutorials
    """
    try:
        response = await local_ai_service.generate_tools(request)
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/providers")
async def get_providers():
    """Get list of available LLM providers."""
    return {
        "providers": llm_service.get_available_providers()
    }


@router.post("/generate-procurement", response_model=ProcurementResponse)
async def generate_procurement(
    request: ProcurementRequest,
    x_processing_agent: Optional[str] = Header(None),
    x_llm_backend: Optional[str] = Header(None),
    x_task_type: Optional[str] = Header(None)
):
    """
    Generate procurement analysis using Ollama + Gemini pipeline.
    
    This endpoint processes laboratory material procurement requests through
    an Ollama processing agent that uses Gemini for supplier search and
    price comparison across multiple trusted vendors.
    
    Args:
        request: Procurement request with materials, quantities, and preferences
        x_processing_agent: Must be 'ollama' for proper routing
        x_llm_backend: Must be 'gemini' for search processing
        x_task_type: Should be 'procurement-search'
        
    Returns:
        Structured procurement data with vendor comparisons and cost analysis
    """
    try:
        # Validate processing pipeline headers
        if x_processing_agent != "ollama":
            raise HTTPException(
                status_code=400, 
                detail="Invalid processing agent. Expected 'ollama'"
            )
        
        if x_llm_backend != "gemini":
            raise HTTPException(
                status_code=400, 
                detail="Invalid LLM backend. Expected 'gemini'"
            )
        
        # Process procurement request through Ollama + Gemini pipeline
        response = await protocol_service.generate_procurement(request)
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error in Ollama/Gemini pipeline: {str(e)}"
        )


@router.post("/upload-inventory", response_model=InventoryUploadResponse)
async def upload_inventory(file: UploadFile = File(...)):
    """
    Upload and process inventory data using Llama LLM.
    
    This endpoint accepts CSV or Excel files, processes them through
    Llama LLM for data normalization, and stores the results in Firebase.
    
    Args:
        file: CSV or Excel file containing inventory data
        
    Returns:
        Upload result with processing statistics and Firebase status
    """
    try:
        # Validate file type
        allowed_types = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
        
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload CSV or Excel files only."
            )
        
        # Process inventory upload through Llama + Firebase pipeline
        response = await protocol_service.upload_inventory(file)
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during inventory upload: {str(e)}"
        )


@router.get("/inventory", response_model=InventoryResponse)
async def get_inventory():
    """
    Retrieve all inventory items from Firebase.
    
    Returns:
        List of all inventory items with current stock levels
    """
    try:
        response = await protocol_service.get_inventory()
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error retrieving inventory: {str(e)}"
        )


@router.post("/inventory/search", response_model=InventoryResponse)
async def search_inventory(request: InventorySearchRequest):
    """
    Search inventory items by material name, brand, or location.
    
    Args:
        request: Search request with search term
        
    Returns:
        Filtered list of inventory items matching the search term
    """
    try:
        response = await protocol_service.search_inventory(request.search_term)
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during inventory search: {str(e)}"
        )


@router.post("/inventory/check-availability", response_model=InventoryResponse)
async def check_inventory_availability(request: InventoryAvailabilityRequest):
    """
    Check availability of a specific material for Procure-Gen integration.
    
    This endpoint is used by the procurement system to verify current
    stock levels before making purchase recommendations.
    
    Args:
        request: Availability check request with material name and quantity
        
    Returns:
        Availability status: "Sufficient", "Insufficient", or "Not Found"
    """
    try:
        response = await protocol_service.check_inventory_availability(
            request.material_name,
            request.required_quantity
        )
        
        if not response.success:
            raise HTTPException(status_code=500, detail=response.error)
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error checking availability: {str(e)}"
        )
