"""Main FastAPI application for Proto-Gen."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered laboratory protocol generation and troubleshooting assistant"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes with both prefixes for compatibility
app.include_router(router, prefix="/api/v1", tags=["protocols"])
app.include_router(router, prefix="/api", tags=["protocols"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Proto-Gen API",
        "version": settings.app_version,
        "docs": "/docs"
    }


@app.get("/api/test")
async def api_test():
    """Test endpoint for API routing."""
    return {"message": "API routing works!", "path": "/api/test"}


@app.get("/api/v1/test")
async def api_v1_test():
    """Test endpoint for API v1 routing."""
    return {"message": "API v1 routing works!", "path": "/api/v1/test"}


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development"
    )
