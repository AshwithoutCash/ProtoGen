# Proto-Gen Architecture Documentation

## System Overview

Proto-Gen is a full-stack web application that uses Large Language Models (LLMs) to generate laboratory protocols and troubleshoot experimental failures. The system follows a client-server architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (React + Vite)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Home      │  │   Generate   │  │ Troubleshoot │     │
│  │    Page      │  │   Protocol   │  │   Protocol   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│           │                │                  │              │
│           └────────────────┴──────────────────┘              │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  API Client  │                          │
│                    └──────────────┘                          │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────┐
│                         Backend                              │
│                    (FastAPI + Python)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Routes                         │  │
│  │  /generate  |  /troubleshoot  |  /health            │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Protocol Service                         │  │
│  │  - Generate Protocol                                  │  │
│  │  - Troubleshoot Protocol                             │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                LLM Service                            │  │
│  │  - OpenAI Integration                                 │  │
│  │  - Anthropic Integration                             │  │
│  │  - Provider Selection                                 │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Prompt Templates                         │  │
│  │  - Protocol Generation Prompts                        │  │
│  │  - Troubleshooting Prompts                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │ API Calls
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    External LLM APIs                         │
│         OpenAI GPT-4  |  Anthropic Claude                   │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Layer

#### Technology Stack
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Markdown**: Markdown rendering
- **Lucide React**: Icon library

#### Key Components

**Pages:**
- `Home.jsx`: Landing page with feature overview
- `GenerateProtocol.jsx`: Form for protocol generation
- `TroubleshootProtocol.jsx`: Form for troubleshooting

**Components:**
- `Layout.jsx`: Main layout with header, navigation, and footer
- `ProtocolDisplay.jsx`: Renders generated protocols with copy/download features

**Services:**
- `api.js`: Centralized API client for backend communication

### Backend Layer

#### Technology Stack
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and settings management
- **OpenAI SDK**: OpenAI API integration
- **Anthropic SDK**: Anthropic API integration
- **Uvicorn**: ASGI server

#### Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes.py          # API endpoint definitions
│   ├── core/
│   │   └── config.py          # Configuration and settings
│   ├── models/
│   │   └── protocol.py        # Pydantic models for requests/responses
│   ├── prompts/
│   │   ├── protocol_generation.py   # Protocol generation prompts
│   │   └── troubleshooting.py       # Troubleshooting prompts
│   └── services/
│       ├── llm_service.py     # LLM provider abstraction
│       └── protocol_service.py # Business logic
├── main.py                     # Application entry point
└── requirements.txt            # Python dependencies
```

### Data Flow

#### Protocol Generation Flow

1. **User Input**: User fills form with experimental details
2. **API Request**: Frontend sends POST to `/api/v1/generate`
3. **Request Validation**: Pydantic validates request data
4. **Prompt Construction**: System builds detailed prompt from template
5. **LLM Call**: Service calls selected LLM provider (OpenAI/Anthropic)
6. **Response Processing**: Parse and format LLM response
7. **Return to Frontend**: Send formatted protocol as Markdown
8. **Display**: Frontend renders Markdown with styling

#### Troubleshooting Flow

1. **User Input**: User provides problem description and original protocol
2. **API Request**: Frontend sends POST to `/api/v1/troubleshoot`
3. **Request Validation**: Pydantic validates request data
4. **Prompt Construction**: System builds troubleshooting prompt
5. **LLM Call**: Service calls LLM with troubleshooting context
6. **Analysis Generation**: LLM generates ranked causes and solutions
7. **Return to Frontend**: Send analysis as Markdown
8. **Display**: Frontend renders troubleshooting analysis

## Key Design Decisions

### 1. Modular Prompt Engineering

Prompts are separated into dedicated modules (`prompts/`) rather than hardcoded in services. This allows:
- Easy prompt iteration and improvement
- Version control of prompt templates
- Reusability across different contexts
- Clear separation of domain knowledge from code logic

### 2. Provider Abstraction

The `LLMService` abstracts away provider-specific details:
- Unified interface for all LLM providers
- Automatic fallback if preferred provider unavailable
- Easy to add new providers (e.g., local models, other APIs)
- Configuration-driven provider selection

### 3. Type Safety with Pydantic

All API requests and responses use Pydantic models:
- Automatic validation of incoming data
- Clear API contracts
- Auto-generated OpenAPI documentation
- Type hints for better IDE support

### 4. Stateless Architecture

The application is stateless:
- No session management required
- Easy to scale horizontally
- Simple deployment model
- Each request is independent

### 5. Markdown as Output Format

Protocols are generated as Markdown:
- Human-readable and editable
- Easy to render in web UI
- Can be exported to various formats
- Supports tables, lists, code blocks
- Version control friendly

## Security Considerations

### API Key Management
- API keys stored in environment variables
- Never exposed to frontend
- `.env` file excluded from version control
- Example `.env.example` provided for setup

### Input Validation
- All user inputs validated with Pydantic
- Length limits on text fields
- Type checking on all parameters
- SQL injection not applicable (no database)

### CORS Configuration
- Configurable allowed origins
- Defaults to localhost for development
- Should be restricted in production

## Performance Considerations

### Caching Strategy
Currently, no caching is implemented. Future improvements could include:
- Cache common protocol templates
- Cache LLM responses for identical requests
- Redis for distributed caching

### Rate Limiting
Not currently implemented. Production deployment should add:
- Per-user rate limits
- Per-IP rate limits
- API key usage tracking

### Async Operations
- FastAPI uses async/await for non-blocking I/O
- LLM calls are awaited to prevent blocking
- Multiple requests can be handled concurrently

## Extensibility

### Adding New Techniques

1. Add technique to `TechniqueType` enum in `models/protocol.py`
2. Update prompt templates with technique-specific knowledge
3. Frontend automatically picks up new techniques

### Adding New LLM Providers

1. Add provider to `LLMProvider` enum
2. Implement provider-specific method in `LLMService`
3. Add API key to configuration
4. Update `generate()` method to handle new provider

### Adding New Features

The modular architecture makes it easy to add:
- Protocol history/saving
- User accounts and authentication
- Protocol sharing and collaboration
- Image upload for troubleshooting
- Protocol comparison
- Export to different formats (PDF, DOCX)

## Testing Strategy

### Recommended Testing Approach

**Unit Tests:**
- Test prompt generation functions
- Test Pydantic model validation
- Test utility functions

**Integration Tests:**
- Test API endpoints with mock LLM responses
- Test error handling
- Test provider fallback logic

**End-to-End Tests:**
- Test complete user flows
- Test with real LLM APIs (in staging)
- Test UI interactions

## Deployment Considerations

### Backend Deployment
- Can be deployed to any platform supporting Python
- Recommended: Railway, Render, AWS Lambda, Google Cloud Run
- Requires environment variables for API keys
- Should use production ASGI server (Gunicorn + Uvicorn)

### Frontend Deployment
- Static site, can be deployed anywhere
- Recommended: Vercel, Netlify, AWS S3 + CloudFront
- Requires environment variable for backend API URL
- Build with `npm run build`

### Environment-Specific Configuration
- Development: Local servers, debug mode on
- Staging: Cloud deployment, test API keys
- Production: Cloud deployment, production API keys, rate limiting

## Future Enhancements

1. **Database Integration**: Store protocols, user history
2. **Authentication**: User accounts and API key management
3. **Image Processing**: Analyze gel images with vision models
4. **Protocol Templates**: Pre-built templates for common procedures
5. **Collaboration**: Share and comment on protocols
6. **Version Control**: Track protocol iterations
7. **Export Options**: PDF, DOCX, LaTeX export
8. **Mobile App**: Native mobile applications
9. **Offline Mode**: Local LLM support for offline use
10. **Analytics**: Usage tracking and insights
