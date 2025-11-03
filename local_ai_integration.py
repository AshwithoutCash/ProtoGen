"""
Proto-Gen Local AI Stack Integration
Ollama handles all AI processing, Gemini only used for web searches
"""

import requests
import json
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import logging
import os

logger = logging.getLogger(__name__)

@dataclass
class LocalAIConfig:
    """Configuration for local AI stack components."""
    ollama_url: str = "http://localhost:11434"
    n8n_url: str = "http://localhost:5678"
    default_model: str = "llama3.1:8b"
    gemini_api_key: str = ""

    def __post_init__(self):
        """Load Gemini API key from environment if not provided."""
        if not self.gemini_api_key:
            self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")

class OllamaClient:
    """Direct client for Ollama API."""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
    
    def generate(self, model: str, prompt: str, system: str = None) -> Dict[str, Any]:
        """Generate response using Ollama."""
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        
        if system:
            payload["system"] = system
        
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=600  # Increased timeout for comprehensive responses
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
            raise

    def list_models(self) -> list:
        """List available models in Ollama."""
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            response.raise_for_status()
            models = response.json().get("models", [])
            return [model["name"] for model in models]
        except Exception as e:
            logger.error(f"Failed to list Ollama models: {e}")
            return []

class GeminiSearchClient:
    """Client for Gemini API - ONLY used for web searches, not AI processing."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
    
    def search_web(self, search_query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Use Gemini to perform web search and return results."""
        if not self.api_key:
            logger.warning("No Gemini API key provided for web search")
            return []
        
        try:
            # Use Gemini's grounding/search capabilities
            url = f"{self.base_url}/models/gemini-1.5-flash:generateContent"
            headers = {"Content-Type": "application/json"}
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Search the web for: {search_query}. Provide factual, up-to-date information."
                    }]
                }],
                "tools": [{
                    "googleSearchRetrieval": {
                        "dynamicRetrievalConfig": {
                            "mode": "MODE_DYNAMIC",
                            "dynamicThreshold": 0.7
                        }
                    }
                }]
            }
            
            response = requests.post(
                f"{url}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                # Extract search results from Gemini response
                search_results = []
                if "candidates" in result and result["candidates"]:
                    content = result["candidates"][0].get("content", {})
                    if "parts" in content:
                        for part in content["parts"]:
                            if "text" in part:
                                search_results.append({
                                    "content": part["text"],
                                    "source": "gemini_search"
                                })
                return search_results[:max_results]
            else:
                logger.error(f"Gemini search failed: {response.status_code} - {response.text}")
                return []
                
        except Exception as e:
            logger.error(f"Gemini search error: {e}")
            return []

class LangflowClient:
    """Client for Langflow API endpoints."""
    
    def __init__(self, base_url: str = "http://localhost:7860"):
        self.base_url = base_url
    
    def run_flow(self, flow_id: str, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a Langflow flow with given inputs."""
        try:
            response = requests.post(
                f"{self.base_url}/api/v1/run/{flow_id}",
                json={"inputs": inputs},
                timeout=120
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Langflow execution failed: {e}")
            raise
    
    def get_flows(self) -> List[Dict[str, Any]]:
        """Get list of available flows."""
        try:
            response = requests.get(f"{self.base_url}/api/v1/flows")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to get Langflow flows: {e}")
            return []

class N8nClient:
    """Client for n8n workflow automation."""
    
    def __init__(self, base_url: str = "http://localhost:5678"):
        self.base_url = base_url
    
    def trigger_workflow(self, webhook_url: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger n8n workflow via webhook."""
        try:
            response = requests.post(webhook_url, json=data, timeout=120)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"n8n workflow trigger failed: {e}")
            raise
    
    def execute_workflow(self, workflow_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute n8n workflow directly."""
        try:
            response = requests.post(
                f"{self.base_url}/rest/workflows/{workflow_id}/execute",
                json=data,
                timeout=120
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"n8n workflow execution failed: {e}")
            raise

class LocalAIService:
    """Main service orchestrating local AI stack for Proto-Gen."""
    
    def __init__(self, config: LocalAIConfig = None):
        self.config = config or LocalAIConfig()
        self.ollama = OllamaClient(self.config.ollama_url)
        self.n8n = N8nClient(self.config.n8n_url)
        self.gemini_search = GeminiSearchClient(self.config.gemini_api_key)
    
    def _ollama_guided_search(self, topic: str, context: str = "") -> List[Dict[str, Any]]:
        """Use Ollama to generate search queries, then Gemini to search."""
        try:
            # Use Ollama to generate optimal search queries
            search_prompt = f"""Generate 3 specific search queries for: {topic}

Context: {context}

Return only the search queries, one per line:"""

            result = self.ollama.generate(
                model=self.config.default_model,
                prompt=search_prompt
            )
            
            # Extract search queries from Ollama response
            queries = []
            if result.get("response"):
                lines = result["response"].strip().split('\n')
                queries = [line.strip() for line in lines if line.strip() and not line.startswith('#')]
            
            # Use Gemini to search for each query
            all_results = []
            for query in queries[:3]:  # Limit to 3 queries
                search_results = self.gemini_search.search_web(query, max_results=3)
                all_results.extend(search_results)
            
            return all_results
            
        except Exception as e:
            logger.error(f"Ollama-guided search failed: {e}")
            return []
    
    def _gemini_research_and_llama_refine(self, request_data: Dict[str, Any]) -> str:
        """Use Gemini for research, then Llama to refine into our specific format."""
        try:
            # Step 1: Use Gemini to gather comprehensive information
            if not self.config.gemini_api_key:
                logger.info("No Gemini API key - using Llama only")
                return self._llama_only_tools(request_data)
            
            # Generate research queries
            search_topic = f"{request_data.get('technique_type')} tools software {request_data.get('data_type')}"
            research_results = self._ollama_guided_search(search_topic)
            
            if not research_results:
                logger.info("No research results - using Llama only")
                return self._llama_only_tools(request_data)
            
            # Step 2: Combine research into comprehensive context
            research_context = "RESEARCH INFORMATION:\n\n"
            for i, result in enumerate(research_results[:6], 1):  # Use top 6 results
                research_context += f"Source {i}: {result.get('content', '')[:300]}...\n\n"
            
            # Step 3: Use Llama to refine into our specific format
            refine_prompt = f"""You are a bioinformatics expert. Using the research information provided, create EXACTLY 2 comprehensive tool recommendations.

TASK: {request_data.get("computational_goal")}
TECHNIQUE: {request_data.get("technique_type")}
DATA TYPE: {request_data.get("data_type")}
REQUIREMENTS: {request_data.get("context", "None")}

{research_context}

Based on the research above, provide EXACTLY 2 tools in this format:

# Tool #1: [Best Tool Name]

## Overview
- What it does and why it's the top choice
- Key features that make it stand out

## Complete Installation Guide
1. System requirements (OS, RAM, etc.)
2. Download instructions with exact URLs
3. Step-by-step installation process
4. Initial configuration steps

## Pricing Details
- Exact cost (free/paid/subscription)
- Academic pricing if available
- License terms

## Detailed Usage Example
```
[Actual commands/steps with real examples]
```

## Alternative Options
- Alternative 1: [name] - [brief comparison]
- Alternative 2: [name] - [brief comparison]

# Tool #2: [Second Best Tool Name]

[Same format as Tool #1]

Use the research information to provide accurate, current details. Make each recommendation comprehensive and actionable."""

            result = self.ollama.generate(
                model=self.config.default_model,
                prompt=refine_prompt,
                system="You are an expert who creates detailed, accurate tool recommendations. Follow the format exactly and provide complete information."
            )
            
            return result.get("response", "")
            
        except Exception as e:
            logger.error(f"Gemini research + Llama refine failed: {e}")
            return self._llama_only_tools(request_data)
    
    def _llama_only_tools(self, request_data: Dict[str, Any]) -> str:
        """Fallback: Use only Llama for tool recommendations with forced structure."""
        
        # Get tool suggestions from Llama with better prompting
        suggestion_prompt = f"""What are the 2 best software tools for: {request_data.get("computational_goal")}

Task: {request_data.get("technique_type")}
Data: {request_data.get("data_type")}
Requirements: {request_data.get("context", "None")}

List exactly 2 specific tool names (not categories):
1. 
2. """

        suggestion_result = self.ollama.generate(
            model=self.config.default_model,
            prompt=suggestion_prompt,
            system="List exactly 2 specific software tool names, nothing else."
        )
        
        # Extract tool names with better parsing
        tool_names = []
        if suggestion_result.get("response"):
            response_text = suggestion_result["response"].strip()
            lines = response_text.split('\n')
            
            for line in lines:
                line = line.strip()
                # Remove numbering and common prefixes
                line = line.replace('1.', '').replace('2.', '').replace('3.', '')
                line = line.replace('Tool 1:', '').replace('Tool 2:', '')
                line = line.replace('-', '').replace('*', '').strip()
                
                # Look for actual tool names (not empty, not too long, not generic)
                if (line and len(line) < 50 and len(line) > 2 and 
                    'tool' not in line.lower() and 'option' not in line.lower() and
                    'software' not in line.lower()):
                    tool_names.append(line)
        
        # Debug: print what we extracted
        logger.info(f"Extracted tool names: {tool_names}")
        
        # Ensure we have exactly 2 tools, use technique-specific defaults if extraction failed
        if len(tool_names) < 2:
            # Use technique-specific defaults based on the request
            technique = request_data.get("technique_type", "").lower()
            goal = request_data.get("computational_goal", "").lower()
            
            if "alignment" in technique or "alignment" in goal:
                tool_names = ["MUSCLE", "Clustal Omega"]
            elif "primer" in technique or "primer" in goal:
                tool_names = ["Primer3", "NCBI Primer-BLAST"]
            elif "phylogen" in technique or "phylogen" in goal:
                tool_names = ["RAxML", "IQ-TREE"]
            elif "model" in technique or "model" in goal or "structure" in goal:
                tool_names = ["PyMOL", "ChimeraX"]
            elif "blast" in goal or "search" in goal:
                tool_names = ["BLAST", "PSI-BLAST"]
            else:
                # Try to get better suggestions with a simpler prompt
                simple_prompt = f"Name 2 software tools for {technique} {goal}:"
                simple_result = self.ollama.generate(
                    model=self.config.default_model,
                    prompt=simple_prompt,
                    system="List only tool names."
                )
                
                if simple_result.get("response"):
                    # Try to extract from simple response
                    words = simple_result["response"].split()
                    potential_tools = []
                    for word in words:
                        word = word.strip('.,()[]{}:;-*')
                        if (len(word) > 2 and len(word) < 30 and 
                            word[0].isupper() and 
                            'tool' not in word.lower()):
                            potential_tools.append(word)
                    
                    if len(potential_tools) >= 2:
                        tool_names = potential_tools[:2]
                    else:
                        tool_names = ["BLAST", "Bioconductor"]
                else:
                    tool_names = ["BLAST", "Bioconductor"]
        
        # Take only first 2
        tool_names = tool_names[:2]
        
        # Now get detailed information for each tool separately for better quality
        tool1_details = self._get_tool_details(tool_names[0], request_data)
        tool2_details = self._get_tool_details(tool_names[1], request_data)
        
        # Create comprehensive response using detailed information
        formatted_response = f"""# Tool #1: {tool_names[0]}

## Overview
{tool1_details['overview']} {tool1_details['features']}

## Complete Installation Guide
1. **System Requirements**: {tool1_details['installation']}
2. **Download**: Visit the official {tool_names[0]} website or repository
3. **Installation**: {tool1_details['installation']}
4. **Initial Setup**: Configure settings according to your specific needs

## Pricing Details
- **Cost**: {tool1_details['pricing']}
- **Academic Pricing**: Check official website for educational discounts
- **License**: Verify license terms on official documentation

## Detailed Usage Example
```bash
# {tool_names[0]} usage for {request_data.get('technique_type')}
{tool1_details['usage']}
# Follow tool-specific documentation for advanced options
```

## Alternative Options
- **Alternative 1**: {tool_names[1]} - Complementary approach with different strengths
- **Alternative 2**: Check bioinformatics tool databases for additional options

# Tool #2: {tool_names[1]}

## Overview
{tool2_details['overview']} {tool2_details['features']}

## Complete Installation Guide
1. **System Requirements**: {tool2_details['installation']}
2. **Download**: Access {tool_names[1]} through official channels
3. **Installation**: {tool2_details['installation']}
4. **Initial Setup**: Follow setup wizard or configuration guide

## Pricing Details
- **Cost**: {tool2_details['pricing']}
- **Academic Pricing**: Educational institutions may have special rates
- **License**: Review licensing terms before use

## Detailed Usage Example
```bash
# {tool_names[1]} workflow for {request_data.get('technique_type')}
{tool2_details['usage']}
# Consult documentation for parameter optimization
```

## Alternative Options
- **Alternative 1**: {tool_names[0]} - Primary alternative with proven track record
- **Alternative 2**: Explore specialized tools for your specific data type

---
*Note: For the most current information, installation guides, and pricing, please visit the official websites of {tool_names[0]} and {tool_names[1]}.*"""
        
        return formatted_response
    
    def _get_tool_details(self, tool_name: str, request_data: Dict[str, Any]) -> Dict[str, str]:
        """Get detailed information about a specific tool."""
        details_prompt = f"""Provide specific information about {tool_name} for {request_data.get('computational_goal')}.

Focus on:
1. What {tool_name} does and its key features
2. System requirements and installation steps
3. Pricing (free/paid/academic)
4. Basic usage commands or workflow
5. Main advantages and limitations

Be specific and factual about {tool_name}."""

        result = self.ollama.generate(
            model=self.config.default_model,
            prompt=details_prompt,
            system=f"Provide accurate, specific information about {tool_name}."
        )
        
        response_text = result.get("response", "")
        
        # Parse the response to extract different sections
        details = {
            "overview": f"{tool_name} is a specialized tool for {request_data.get('technique_type')}.",
            "installation": "Standard installation process varies by platform.",
            "pricing": "Check official website for current pricing information.",
            "usage": f"Basic usage involves standard {request_data.get('technique_type')} workflow.",
            "features": f"Key features include {request_data.get('technique_type')} capabilities."
        }
        
        # Try to extract more specific information from the response
        if response_text:
            # Simple extraction - look for key information
            lines = response_text.split('\n')
            current_section = "overview"
            
            for line in lines:
                line = line.strip()
                if line:
                    if any(word in line.lower() for word in ['feature', 'capability', 'function']):
                        details["features"] = line
                    elif any(word in line.lower() for word in ['install', 'download', 'setup']):
                        details["installation"] = line
                    elif any(word in line.lower() for word in ['price', 'cost', 'free', 'paid']):
                        details["pricing"] = line
                    elif any(word in line.lower() for word in ['usage', 'command', 'run', 'execute']):
                        details["usage"] = line
                    elif len(details["overview"]) < 100:  # If overview is still short, expand it
                        details["overview"] = line
        
        return details
    
    def generate_protocol_local(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate protocol using local AI stack (Ollama directly)."""
        try:
            # Create system prompt for protocol generation
            system_prompt = """You are an expert molecular biologist. Generate detailed, step-by-step laboratory protocols that are scientifically accurate and reproducible. Format as structured markdown with clear sections, numbered steps, and specific quantities."""

            # Create user prompt with specific details
            user_prompt = f"""Generate a detailed laboratory protocol for the following:

**Experimental Goal**: {request_data.get("experimental_goal")}
**Technique**: {request_data.get("technique")}
**Reagents**: {request_data.get("reagents")}
**Template/Starting Material**: {request_data.get("template")}
**Number of Reactions**: {request_data.get("num_reactions", "1")}
**Additional Parameters**: {request_data.get("other_params", "None specified")}

Please provide a comprehensive protocol that includes all necessary steps, materials, and safety considerations."""

            # Optionally search for additional information if Gemini API key is available
            search_context = ""
            if self.config.gemini_api_key:
                search_topic = f"{request_data.get('technique')} protocol {request_data.get('experimental_goal')}"
                search_results = self._ollama_guided_search(search_topic, user_prompt)
                
                if search_results:
                    search_context = "\n\n**Additional Research Context:**\n"
                    for i, result in enumerate(search_results[:3], 1):
                        search_context += f"{i}. {result.get('content', '')[:200]}...\n"
                    
                    user_prompt += search_context + "\n\nPlease incorporate relevant information from the research context above into your protocol."

            # Generate protocol using Ollama
            result = self.ollama.generate(
                model=self.config.default_model,
                prompt=user_prompt,
                system=system_prompt
            )
            
            return {
                "success": True,
                "protocol": result.get("response", ""),
                "provider_used": "local_ai_stack",
                "model_used": self.config.default_model
            }
            
        except Exception as e:
            logger.error(f"Local protocol generation failed: {e}")
            return {
                "success": False,
                "protocol": "",
                "provider_used": "local_ai_stack",
                "error": str(e)
            }
    
    def troubleshoot_protocol_local(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Troubleshoot protocol using Ollama (with optional Gemini search)."""
        try:
            # Create system prompt for troubleshooting
            system_prompt = """You are an expert laboratory troubleshooter with extensive experience in molecular biology protocols. Analyze the provided protocol issue and provide:

1. **Root Cause Analysis**: Identify the most likely causes of the problem
2. **Systematic Diagnosis**: Step-by-step approach to confirm the cause
3. **Specific Solutions**: Detailed corrective actions with rationale
4. **Prevention Strategies**: How to avoid this issue in future experiments

Consider:
- Protocol deviations
- Equipment issues
- Reagent quality/storage
- Environmental factors
- Technique variations
- Contamination sources

Provide your analysis in structured markdown format with clear sections and actionable recommendations."""

            # Create user prompt with troubleshooting details
            user_prompt = f"""Analyze this laboratory protocol issue:

**Original Protocol**: {request_data.get("protocol_text", "Not provided")}

**Issue Description**: {request_data.get("issue_description")}

**Expected Outcome**: {request_data.get("expected_outcome")}

**Actual Outcome**: {request_data.get("actual_outcome")}

Please provide a comprehensive troubleshooting analysis with specific solutions."""

            # Optionally search for troubleshooting information
            if self.config.gemini_api_key and request_data.get("issue_description"):
                search_topic = f"troubleshooting {request_data.get('issue_description')}"
                search_results = self._ollama_guided_search(search_topic, user_prompt)
                
                if search_results:
                    search_context = "\n\n**Additional Troubleshooting Resources:**\n"
                    for i, result in enumerate(search_results[:3], 1):
                        search_context += f"{i}. {result.get('content', '')[:200]}...\n"
                    
                    user_prompt += search_context + "\n\nPlease incorporate relevant troubleshooting insights from the research above."

            # Generate troubleshooting analysis using Ollama
            result = self.ollama.generate(
                model=self.config.default_model,
                prompt=user_prompt,
                system=system_prompt
            )
            
            return {
                "success": True,
                "analysis": result.get("response", ""),
                "provider_used": "local_ai_stack",
                "model_used": self.config.default_model
            }
            
        except Exception as e:
            logger.error(f"Local troubleshooting failed: {e}")
            return {
                "success": False,
                "analysis": "",
                "provider_used": "local_ai_stack",
                "error": str(e)
            }
    
    def generate_routes_local(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate experimental routes using n8n orchestration."""
        try:
            # Use n8n workflow for route generation (includes web search, comparison)
            workflow_data = {
                "overarching_goal": request_data.get("overarching_goal"),
                "starting_material": request_data.get("starting_material"),
                "target_organism": request_data.get("target_organism"),
                "constraints": request_data.get("constraints", "")
            }
            
            # Execute n8n route generation workflow
            # Note: Replace with actual n8n workflow webhook URL
            webhook_url = f"{self.config.n8n_url}/webhook/route-generation"
            result = self.n8n.trigger_workflow(webhook_url, workflow_data)
            
            return {
                "success": True,
                "routes": result.get("routes", ""),
                "provider_used": "local_ai_stack",
                "model_used": self.config.default_model
            }
            
        except Exception as e:
            logger.error(f"Local route generation failed: {e}")
            return {
                "success": False,
                "routes": "",
                "provider_used": "local_ai_stack",
                "error": str(e)
            }
    
    def generate_tools_local(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate tool recommendations using Gemini research + Llama refinement."""
        try:
            logger.info("Starting two-stage tool generation: Gemini research + Llama refinement")
            
            # Use the new two-stage approach
            refined_response = self._gemini_research_and_llama_refine(request_data)
            
            logger.info(f"Refined response length: {len(refined_response)}")
            
            return {
                "success": True,
                "tools": refined_response,
                "provider_used": "local_ai_stack_enhanced",
                "model_used": self.config.default_model
            }
            
        except Exception as e:
            logger.error(f"Enhanced tool generation failed: {e}")
            return {
                "success": False,
                "tools": "",
                "provider_used": "local_ai_stack",
                "error": str(e)
            }
    
    def health_check(self) -> Dict[str, Any]:
        """Check health of all local AI stack components."""
        health_status = {
            "ollama": False,
            "n8n": False,
            "overall": False
        }
        
        # Check Ollama
        try:
            models = self.ollama.list_models()
            health_status["ollama"] = len(models) > 0
        except:
            pass
        
        # Check n8n
        try:
            response = requests.get(f"{self.config.n8n_url}/rest/login", timeout=3)
            health_status["n8n"] = response.status_code in [200, 401]
        except:
            pass
        
        health_status["overall"] = all([
            health_status["ollama"],
            health_status["n8n"]
        ])
        
        return health_status
    
    def _format_tool_recommendations(self, raw_response: str, request_data: Dict[str, Any]) -> str:
        """Format the raw LLM response into exactly 2 comprehensive tool recommendations."""
        
        # Extract tool names from the response (simple heuristic)
        lines = raw_response.split('\n')
        tool_names = []
        
        # Look for tool names in common patterns
        for line in lines:
            line = line.strip()
            if any(pattern in line.lower() for pattern in ['primer', 'blast', 'oligo', 'pcr', 'design']):
                if any(marker in line for marker in ['**', '##', '1.', '2.', '*']):
                    # Extract tool name
                    clean_name = line.replace('*', '').replace('#', '').replace('1.', '').replace('2.', '').strip()
                    if clean_name and len(clean_name) < 50:  # Reasonable tool name length
                        tool_names.append(clean_name)
        
        # Take first 2 unique tool names
        unique_tools = []
        for tool in tool_names:
            if tool not in unique_tools and len(unique_tools) < 2:
                unique_tools.append(tool)
        
        # If we don't have 2 tools, use defaults
        if len(unique_tools) < 2:
            if request_data.get("technique_type", "").lower() == "primer design":
                unique_tools = ["Primer3", "NCBI Primer-BLAST"]
            else:
                unique_tools = ["Tool Option 1", "Tool Option 2"]
        
        # Generate formatted response
        formatted_response = f"""# Tool Recommendation #1: {unique_tools[0]}

## Overview
{unique_tools[0]} is a highly recommended tool for {request_data.get('technique_type', 'computational analysis')}. It provides comprehensive functionality for {request_data.get('computational_goal', 'your research needs')} with excellent support for {request_data.get('data_type', 'various data formats')}.

## Beginner Installation Guide
1. **System Requirements**: Windows/Mac/Linux, 4GB RAM minimum
2. **Download**: Visit the official website or repository
3. **Installation**: Follow standard installation procedures for your OS
4. **Initial Setup**: Configure basic settings and verify installation

## Pricing
- **Cost**: Free (open source) / Check official website for current pricing
- **Academic Discounts**: Often available for educational institutions
- **Free Alternatives**: Community versions typically available

## Usage Example
```
# Basic usage example for {request_data.get('technique_type', 'analysis')}
1. Load your {request_data.get('data_type', 'data file')}
2. Configure analysis parameters
3. Run the analysis
4. Review and export results
```

## Alternatives
- **Alternative 1**: Similar functionality with different interface options
- **Alternative 2**: Commercial alternative with additional features

# Tool Recommendation #2: {unique_tools[1]}

## Overview
{unique_tools[1]} serves as an excellent secondary option for {request_data.get('technique_type', 'computational analysis')}. It offers complementary features and may be preferred for specific use cases or workflow requirements.

## Beginner Installation Guide
1. **System Requirements**: Standard computer with internet access
2. **Download**: Available through official channels
3. **Installation**: User-friendly installation process
4. **Initial Setup**: Quick setup wizard for new users

## Pricing
- **Cost**: Varies (check official website for current pricing)
- **Academic Discounts**: Educational pricing often available
- **Free Trial**: Many tools offer trial periods

## Usage Example
```
# Step-by-step workflow for {request_data.get('technique_type', 'analysis')}
1. Import {request_data.get('data_type', 'your data')}
2. Select appropriate analysis method
3. Adjust parameters as needed
4. Execute analysis and interpret results
```

## Alternatives
- **Alternative 1**: Open-source option with community support
- **Alternative 2**: Enterprise solution with professional support

---
*Note: Pricing and availability may change. Please check official websites for the most current information.*"""

        return formatted_response

# Global instance for use in FastAPI endpoints
local_ai_service = LocalAIService()
