from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Union
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Keys
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    gemini_api_key: str = ""
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    environment: str = "development"
    
    # CORS Settings
    cors_origins: Union[list[str], str] = "http://localhost:5173,http://localhost:3000"
    
    # Application Settings
    app_name: str = "Proto-Gen API"
    app_version: str = "1.0.0"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        env_parse_none_str="null"
    )
    
    @field_validator('cors_origins', mode='after')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v


settings = Settings()
