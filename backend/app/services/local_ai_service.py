"""
Local AI Service for Proto-Gen
Integrates with Langflow, n8n, and Ollama for local AI processing
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

from local_ai_integration import LocalAIService, LocalAIConfig
from app.models.protocol import (
    ProtocolGenerationRequest, ProtocolResponse,
    TroubleshootingRequest, TroubleshootingResponse,
    RouteGenRequest, RouteGenResponse,
    ToolGenRequest, ToolGenResponse
)
import logging

logger = logging.getLogger(__name__)

class ProtoGenLocalAIService:
    """Proto-Gen service using local AI stack instead of external APIs."""
    
    def __init__(self):
        self.local_ai = LocalAIService()
        self.is_local_mode = self._check_local_ai_availability()
    
    def _check_local_ai_availability(self) -> bool:
        """Check if local AI stack is available and ready."""
        try:
            health = self.local_ai.health_check()
            is_available = health.get("overall", False)
            if is_available:
                logger.info("Local AI stack (Ollama + n8n) is available and ready")
            else:
                logger.warning("Local AI stack not fully available")
            return is_available
        except Exception as e:
            logger.warning(f"Local AI stack not available: {e}")
            return False
    
    async def generate_protocol(self, request: ProtocolGenerationRequest) -> ProtocolResponse:
        """Generate protocol using local AI stack."""
        if not self.is_local_mode:
            return ProtocolResponse(
                success=False,
                protocol="",
                provider_used="local_ai_stack",
                error="Local AI stack not available. Please run setup_checker.py"
            )
        
        try:
            request_data = {
                "experimental_goal": request.experimental_goal,
                "technique": request.technique,
                "reagents": request.reagents,
                "template": request.template,
                "num_reactions": request.num_reactions,
                "other_params": request.other_params
            }
            
            result = self.local_ai.generate_protocol_local(request_data)
            
            return ProtocolResponse(
                success=result["success"],
                protocol=result["protocol"],
                provider_used=result["provider_used"],
                error=result.get("error")
            )
            
        except Exception as e:
            logger.error(f"Protocol generation failed: {e}")
            return ProtocolResponse(
                success=False,
                protocol="",
                provider_used="local_ai_stack",
                error=str(e)
            )
    
    async def troubleshoot_protocol(self, request: TroubleshootingRequest) -> TroubleshootingResponse:
        """Troubleshoot protocol using local AI stack."""
        if not self.is_local_mode:
            return TroubleshootingResponse(
                success=False,
                analysis="",
                provider_used="local_ai_stack",
                error="Local AI stack not available. Please run setup_checker.py"
            )
        
        try:
            request_data = {
                "protocol_text": request.protocol_text,
                "issue_description": request.issue_description,
                "expected_outcome": request.expected_outcome,
                "actual_outcome": request.actual_outcome
            }
            
            result = self.local_ai.troubleshoot_protocol_local(request_data)
            
            return TroubleshootingResponse(
                success=result["success"],
                analysis=result["analysis"],
                provider_used=result["provider_used"],
                error=result.get("error")
            )
            
        except Exception as e:
            logger.error(f"Troubleshooting failed: {e}")
            return TroubleshootingResponse(
                success=False,
                analysis="",
                provider_used="local_ai_stack",
                error=str(e)
            )
    
    async def generate_routes(self, request: RouteGenRequest) -> RouteGenResponse:
        """Generate experimental routes using local AI stack."""
        if not self.is_local_mode:
            return RouteGenResponse(
                success=False,
                routes="",
                provider_used="local_ai_stack",
                error="Local AI stack not available. Please run setup_checker.py"
            )
        
        try:
            request_data = {
                "overarching_goal": request.overarching_goal,
                "starting_material": request.starting_material,
                "target_organism": request.target_organism,
                "constraints": request.constraints
            }
            
            result = self.local_ai.generate_routes_local(request_data)
            
            return RouteGenResponse(
                success=result["success"],
                routes=result["routes"],
                provider_used=result["provider_used"],
                error=result.get("error")
            )
            
        except Exception as e:
            logger.error(f"Route generation failed: {e}")
            return RouteGenResponse(
                success=False,
                routes="",
                provider_used="local_ai_stack",
                error=str(e)
            )
    
    async def generate_tools(self, request: ToolGenRequest) -> ToolGenResponse:
        """Generate tool recommendations using local AI stack."""
        if not self.is_local_mode:
            return ToolGenResponse(
                success=False,
                tools="",
                provider_used="local_ai_stack",
                error="Local AI stack not available. Please run setup_checker.py"
            )
        
        try:
            request_data = {
                "computational_goal": request.user_goal,
                "technique_type": request.technique,
                "data_type": request.data_type,
                "context": request.additional_context or ""
            }
            
            result = self.local_ai.generate_tools_local(request_data)
            
            return ToolGenResponse(
                success=result["success"],
                tools=result["tools"],
                provider_used=result["provider_used"],
                error=result.get("error")
            )
            
        except Exception as e:
            logger.error(f"Tool generation failed: {e}")
            return ToolGenResponse(
                success=False,
                tools="",
                provider_used="local_ai_stack",
                error=str(e)
            )
    
    def get_health_status(self) -> dict:
        """Get health status of local AI stack."""
        return self.local_ai.health_check()

# Global service instance
local_ai_service = ProtoGenLocalAIService()
