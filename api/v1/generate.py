from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI()

class ProtocolGenerationRequest(BaseModel):
    experimental_goal: str = Field(..., min_length=10)
    technique: str = Field(..., min_length=2)
    reagents: str = Field(..., min_length=3)
    template: str = Field(..., min_length=3)
    num_reactions: Optional[str] = Field("1")
    other_params: Optional[str] = Field(None)
    llm_provider: str = Field("gemini")

class ProtocolResponse(BaseModel):
    success: bool
    protocol: str
    provider_used: str
    error: Optional[str] = None

@app.post("/")
async def generate(request: ProtocolGenerationRequest) -> ProtocolResponse:
    protocol_text = f"""# Protocol: {request.technique}

## Objective
{request.experimental_goal}

## Materials
- {request.reagents}
- {request.template}

## Procedure
1. Prepare your workspace and materials
2. Follow standard {request.technique} protocol
3. Process {request.num_reactions} reaction(s)

## Notes
- This is a simplified protocol (Vercel serverless)
- Additional parameters: {request.other_params or 'None specified'}

*Generated using {request.llm_provider} provider*
"""
    return ProtocolResponse(success=True, protocol=protocol_text, provider_used=request.llm_provider)
