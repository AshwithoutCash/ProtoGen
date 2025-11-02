"""Service for interacting with LLM providers."""

import openai
import anthropic
import google.generativeai as genai
from typing import Optional, Tuple
from app.core.config import settings
from app.models.protocol import LLMProvider


class LLMService:
    """Service for generating text using various LLM providers."""
    
    def __init__(self):
        """Initialize LLM clients."""
        self.openai_client = None
        self.anthropic_client = None
        self.gemini_client = None
        
        # Initialize OpenAI client if API key is available
        if settings.openai_api_key:
            openai.api_key = settings.openai_api_key
            self.openai_client = openai
        
        # Initialize Anthropic client if API key is available
        if settings.anthropic_api_key:
            self.anthropic_client = anthropic.Anthropic(
                api_key=settings.anthropic_api_key
            )
        
        # Initialize Gemini client if API key is available
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.gemini_client = genai
    
    def is_provider_available(self, provider: LLMProvider) -> bool:
        """Check if a specific provider is available."""
        if provider == LLMProvider.OPENAI:
            return self.openai_client is not None and bool(settings.openai_api_key)
        elif provider == LLMProvider.ANTHROPIC:
            return self.anthropic_client is not None and bool(settings.anthropic_api_key)
        elif provider == LLMProvider.GEMINI:
            return self.gemini_client is not None and bool(settings.gemini_api_key)
        return False
    
    def get_available_providers(self) -> list[str]:
        """Get list of available providers."""
        providers = []
        if self.is_provider_available(LLMProvider.GEMINI):
            providers.append("gemini")
        if self.is_provider_available(LLMProvider.OPENAI):
            providers.append("openai")
        if self.is_provider_available(LLMProvider.ANTHROPIC):
            providers.append("anthropic")
        return providers
    
    async def generate_with_openai(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str = "gpt-4-turbo-preview",
        temperature: float = 0.3,
        max_tokens: int = 4000
    ) -> str:
        """Generate text using OpenAI's API."""
        if not self.openai_client:
            raise ValueError("OpenAI client is not initialized. Please provide an API key.")
        
        try:
            response = await openai.ChatCompletion.acreate(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    async def generate_with_anthropic(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str = "claude-3-sonnet-20240229",
        temperature: float = 0.3,
        max_tokens: int = 4000
    ) -> str:
        """Generate text using Anthropic's API."""
        if not self.anthropic_client:
            raise ValueError("Anthropic client is not initialized. Please provide an API key.")
        
        try:
            message = self.anthropic_client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            return message.content[0].text
        
        except Exception as e:
            raise Exception(f"Anthropic API error: {str(e)}")
    
    async def generate_with_gemini(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str = "models/gemini-2.5-flash",
        temperature: float = 0.3,
        max_tokens: int = 8000
    ) -> str:
        """Generate text using Google Gemini API."""
        if not self.gemini_client:
            raise ValueError("Gemini client is not initialized. Please provide an API key.")
        
        try:
            # Combine system and user prompts for Gemini
            combined_prompt = f"{system_prompt}\n\n{user_prompt}"
            
            model_instance = self.gemini_client.GenerativeModel(model)
            response = model_instance.generate_content(
                combined_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                )
            )
            
            # Check if response was blocked or incomplete
            if response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                if hasattr(candidate, 'finish_reason') and candidate.finish_reason:
                    print(f"Response finish reason: {candidate.finish_reason}")
                
                # Try to get the full text
                if hasattr(candidate.content, 'parts') and candidate.content.parts:
                    full_text = ""
                    for part in candidate.content.parts:
                        if hasattr(part, 'text'):
                            full_text += part.text
                    return full_text
            
            return response.text
        
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        provider: LLMProvider = LLMProvider.GEMINI,
        temperature: float = 0.3,
        max_tokens: int = 4000
    ) -> Tuple[str, str]:
        """
        Generate text using the specified provider.
        
        Returns:
            Tuple of (generated_text, provider_used)
        """
        # Check if requested provider is available
        if not self.is_provider_available(provider):
            # Try to fall back to another provider
            available = self.get_available_providers()
            if not available:
                raise ValueError(
                    "No LLM providers are available. Please configure API keys in .env file."
                )
            
            # Use first available provider
            provider = LLMProvider(available[0])
            print(f"Requested provider not available, falling back to {provider.value}")
        
        # Generate with the selected provider
        if provider == LLMProvider.GEMINI:
            text = await self.generate_with_gemini(
                system_prompt, user_prompt, temperature=temperature, max_tokens=max_tokens
            )
            return text, "gemini"
        
        elif provider == LLMProvider.OPENAI:
            text = await self.generate_with_openai(
                system_prompt, user_prompt, temperature=temperature, max_tokens=max_tokens
            )
            return text, "openai"
        
        elif provider == LLMProvider.ANTHROPIC:
            text = await self.generate_with_anthropic(
                system_prompt, user_prompt, temperature=temperature, max_tokens=max_tokens
            )
            return text, "anthropic"
        
        else:
            raise ValueError(f"Unsupported provider: {provider}")


# Global instance
llm_service = LLMService()
