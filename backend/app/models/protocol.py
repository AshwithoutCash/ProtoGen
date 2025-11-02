from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class TechniqueType(str, Enum):
    """Supported laboratory techniques."""
    PCR = "PCR"
    QPCR = "qPCR"
    GIBSON_ASSEMBLY = "Gibson Assembly"
    MINIPREP = "Miniprep"
    GEL_ELECTROPHORESIS = "Gel Electrophoresis"
    RESTRICTION_DIGESTION = "Restriction Digestion"
    LIGATION = "Ligation"
    TRANSFORMATION = "Transformation"
    WESTERN_BLOT = "Western Blot"
    ELISA = "ELISA"
    OTHER = "Other"


class LLMProvider(str, Enum):
    """Supported LLM providers."""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"


class ProtocolGenerationRequest(BaseModel):
    """Request model for protocol generation."""
    
    experimental_goal: str = Field(
        ...,
        description="The experimental goal (e.g., 'Amplify a gene for cloning')",
        min_length=10
    )
    technique: str = Field(
        ...,
        description="The core laboratory technique to use (e.g., 'PCR', 'qPCR', 'Gibson Assembly')",
        min_length=2
    )
    reagents: str = Field(
        ...,
        description="Key reagents/enzymes (e.g., 'Q5 Polymerase')",
        min_length=3
    )
    template_details: str = Field(
        ...,
        description="Template details (e.g., 'Human genomic DNA, 50 ng/µL')",
        min_length=5
    )
    primer_details: Optional[str] = Field(
        None,
        description="Primer/DNA fragment details (e.g., 'Primer F: ATGC..., Primer R: GCTA...')"
    )
    amplicon_size: Optional[str] = Field(
        None,
        description="Desired amplicon size (e.g., '700 bp')"
    )
    reaction_volume: Optional[str] = Field(
        "25",
        description="Desired reaction volume in µL (default: 25)"
    )
    num_reactions: Optional[str] = Field(
        "1",
        description="Number of reactions (default: 1)"
    )
    other_params: Optional[str] = Field(
        None,
        description="Any other relevant parameters or special requirements"
    )
    llm_provider: LLMProvider = Field(
        LLMProvider.GEMINI,
        description="LLM provider to use for generation"
    )


class TroubleshootingRequest(BaseModel):
    """Request model for protocol troubleshooting."""
    
    observed_problem: str = Field(
        ...,
        description="Description of the observed problem",
        min_length=10
    )
    original_protocol: str = Field(
        ...,
        description="The original protocol that was used",
        min_length=20
    )
    additional_details: Optional[str] = Field(
        None,
        description="Any additional details about the experiment"
    )
    technique: Optional[str] = Field(
        None,
        description="The technique used (if known)"
    )
    llm_provider: LLMProvider = Field(
        LLMProvider.GEMINI,
        description="LLM provider to use for troubleshooting"
    )


class ProtocolResponse(BaseModel):
    """Response model for protocol generation and troubleshooting."""
    
    success: bool = Field(..., description="Whether the request was successful")
    protocol: str = Field(..., description="The generated protocol in Markdown format")
    provider_used: str = Field(..., description="The LLM provider that was used")
    error: Optional[str] = Field(None, description="Error message if request failed")


class RouteGenRequest(BaseModel):
    """Request model for experimental route planning."""
    
    overarching_goal: str = Field(
        ...,
        description="The overarching scientific goal (e.g., 'Express and purify a His-tagged protein in E. coli')",
        min_length=10
    )
    starting_material: str = Field(
        ...,
        description="Starting material (e.g., 'Plasmid DNA', 'Mammalian genomic DNA')",
        min_length=3
    )
    target_organism: str = Field(
        ...,
        description="Target organism (e.g., 'E. coli', 'HeLa cells', 'S. cerevisiae')",
        min_length=2
    )
    constraints: Optional[str] = Field(
        None,
        description="Constraints or resources (e.g., 'Must be low-cost', 'Need to finish in 5 days')"
    )
    llm_provider: LLMProvider = Field(
        LLMProvider.GEMINI,
        description="LLM provider to use for route generation"
    )


class RouteGenResponse(BaseModel):
    """Response model for experimental route planning."""
    
    success: bool = Field(..., description="Whether the request was successful")
    routes: str = Field(..., description="The generated experimental routes in Markdown format")
    provider_used: str = Field(..., description="The LLM provider that was used")
    error: Optional[str] = Field(None, description="Error message if request failed")


class ToolGenRequest(BaseModel):
    """Request model for computational tool recommendations."""
    
    user_goal: str = Field(
        ...,
        description="The overall project goal (e.g., 'Design primers for PCR amplification')",
        min_length=10
    )
    technique: str = Field(
        ...,
        description="Current step/technique (e.g., 'Primer Design', 'Sequence Alignment', 'Plasmid Mapping')",
        min_length=3
    )
    data_type: str = Field(
        ...,
        description="Input data type (e.g., 'Short DNA Sequence', 'Paired-end Illumina Reads', 'GenBank File')",
        min_length=3
    )
    additional_context: Optional[str] = Field(
        None,
        description="Additional context or specific requirements"
    )
    llm_provider: LLMProvider = Field(
        LLMProvider.GEMINI,
        description="LLM provider to use for tool recommendations"
    )


class ToolGenResponse(BaseModel):
    """Response model for computational tool recommendations."""
    
    success: bool = Field(..., description="Whether the request was successful")
    recommendations: str = Field(..., description="The generated tool recommendations in Markdown format")
    provider_used: str = Field(..., description="The LLM provider that was used")
    error: Optional[str] = Field(None, description="Error message if request failed")


class HealthResponse(BaseModel):
    """Response model for health check."""
    
    status: str
    version: str
    available_providers: List[str]
