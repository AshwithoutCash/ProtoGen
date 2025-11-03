"""API routes for Proto-Gen."""

from fastapi import APIRouter, HTTPException
from app.models.protocol import (
    ProtocolGenerationRequest,
    TroubleshootingRequest,
    ProtocolResponse,
    RouteGenRequest,
    RouteGenResponse,
    ToolGenRequest,
    ToolGenResponse,
    HealthResponse
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
