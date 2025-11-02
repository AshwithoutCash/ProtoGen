"""Service for protocol generation and troubleshooting."""

from app.services.llm_service import llm_service
from app.prompts import protocol_generation, troubleshooting, route_generation, tool_generation
from app.models.protocol import (
    ProtocolGenerationRequest,
    TroubleshootingRequest,
    ProtocolResponse,
    RouteGenRequest,
    RouteGenResponse,
    ToolGenRequest,
    ToolGenResponse
)


class ProtocolService:
    """Service for handling protocol-related operations."""
    
    async def generate_protocol(
        self,
        request: ProtocolGenerationRequest
    ) -> ProtocolResponse:
        """
        Generate a laboratory protocol based on user input.
        
        Args:
            request: Protocol generation request
            
        Returns:
            ProtocolResponse with generated protocol
        """
        try:
            # Build the user prompt
            user_prompt = protocol_generation.generate_protocol_prompt(
                experimental_goal=request.experimental_goal,
                technique=request.technique,
                reagents=request.reagents,
                template_details=request.template_details,
                primer_details=request.primer_details or "",
                amplicon_size=request.amplicon_size or "",
                reaction_volume=request.reaction_volume or "25",
                num_reactions=request.num_reactions or "1",
                other_params=request.other_params or ""
            )
            
            # Generate protocol using LLM
            protocol_text, provider_used = await llm_service.generate(
                system_prompt=protocol_generation.SYSTEM_PROMPT,
                user_prompt=user_prompt,
                provider=request.llm_provider,
                temperature=0.3,
                max_tokens=8000
            )
            
            return ProtocolResponse(
                success=True,
                protocol=protocol_text,
                provider_used=provider_used
            )
        
        except Exception as e:
            return ProtocolResponse(
                success=False,
                protocol="",
                provider_used="",
                error=str(e)
            )
    
    async def troubleshoot_protocol(
        self,
        request: TroubleshootingRequest
    ) -> ProtocolResponse:
        """
        Troubleshoot a failed protocol.
        
        Args:
            request: Troubleshooting request
            
        Returns:
            ProtocolResponse with troubleshooting analysis
        """
        try:
            # Build the user prompt
            user_prompt = troubleshooting.generate_troubleshooting_prompt(
                observed_problem=request.observed_problem,
                original_protocol=request.original_protocol,
                additional_details=request.additional_details or "",
                technique=request.technique if request.technique else ""
            )
            
            # Generate troubleshooting analysis using LLM
            analysis_text, provider_used = await llm_service.generate(
                system_prompt=troubleshooting.SYSTEM_PROMPT,
                user_prompt=user_prompt,
                provider=request.llm_provider,
                temperature=0.4,  # Slightly higher temperature for more creative troubleshooting
                max_tokens=8000
            )
            
            return ProtocolResponse(
                success=True,
                protocol=analysis_text,
                provider_used=provider_used
            )
        
        except Exception as e:
            return ProtocolResponse(
                success=False,
                protocol="",
                provider_used="",
                error=str(e)
            )
    
    async def generate_routes(
        self,
        request: RouteGenRequest
    ) -> RouteGenResponse:
        """
        Generate experimental routes for a complex scientific goal.
        
        Args:
            request: Route generation request
            
        Returns:
            RouteGenResponse with generated routes
        """
        try:
            # Build the user prompt
            user_prompt = route_generation.generate_route_prompt(
                overarching_goal=request.overarching_goal,
                starting_material=request.starting_material,
                target_organism=request.target_organism,
                constraints=request.constraints or ""
            )
            
            # Generate routes using LLM
            routes_text, provider_used = await llm_service.generate(
                system_prompt=route_generation.SYSTEM_PROMPT,
                user_prompt=user_prompt,
                provider=request.llm_provider,
                temperature=0.4,  # Slightly higher temperature for creative route planning
                max_tokens=8000
            )
            
            return RouteGenResponse(
                success=True,
                routes=routes_text,
                provider_used=provider_used
            )
        
        except Exception as e:
            return RouteGenResponse(
                success=False,
                routes="",
                provider_used="",
                error=str(e)
            )
    
    async def generate_tools(
        self,
        request: ToolGenRequest
    ) -> ToolGenResponse:
        """
        Generate computational tool recommendations for a specific task.
        
        Args:
            request: Tool generation request
            
        Returns:
            ToolGenResponse with tool recommendations
        """
        try:
            # Build the user prompt
            user_prompt = tool_generation.generate_tool_prompt(
                user_goal=request.user_goal,
                technique=request.technique,
                data_type=request.data_type,
                additional_context=request.additional_context or ""
            )
            
            # Generate tool recommendations using LLM
            recommendations_text, provider_used = await llm_service.generate(
                system_prompt=tool_generation.SYSTEM_PROMPT,
                user_prompt=user_prompt,
                provider=request.llm_provider,
                temperature=0.3,  # Lower temperature for more focused recommendations
                max_tokens=8000
            )
            
            return ToolGenResponse(
                success=True,
                recommendations=recommendations_text,
                provider_used=provider_used
            )
        
        except Exception as e:
            return ToolGenResponse(
                success=False,
                recommendations="",
                provider_used="",
                error=str(e)
            )


# Global instance
protocol_service = ProtocolService()
