# Backend Setup Guide

## Quick Start

The backend is now fully implemented with the procurement endpoint! Here's how to get it running:

### 1. Configure API Keys

Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add at least one API key:

**Option A: Gemini (Recommended - Free)**
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```
Get free API key at: https://makersuite.google.com/app/apikey

**Option B: OpenAI**
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

**Option C: Anthropic**
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the Server

```bash
cd backend
python main.py
```

The server will start on `http://localhost:8000`

### 4. Test the API

Visit `http://localhost:8000/docs` to see the interactive API documentation.

## Procurement Endpoint

The procurement feature is now available at:
- **Endpoint**: `POST /api/v1/generate-procurement`
- **Headers**: 
  - `X-Processing-Agent: ollama`
  - `X-LLM-Backend: gemini`
  - `X-Task-Type: procurement-search`

## Current Status

✅ **Implemented Features:**
- Generate Protocol (`/api/v1/generate`)
- Troubleshoot Protocol (`/api/v1/troubleshoot`) 
- Route Generation (`/api/v1/routes`)
- Tool Generation (`/api/v1/tools`)
- **Procurement Analysis (`/api/v1/generate-procurement`)** ← NEW!

✅ **Frontend Integration:**
- All features connected to backend
- Proper error handling
- Loading states with DNA animation

## Error Messages

If you see "LLM service not configured", you need to:
1. Create `backend/.env` file
2. Add at least one API key (Gemini recommended)
3. Restart the backend server

## Next Steps

1. **Configure API Keys** - Set up at least Gemini API key
2. **Start Backend** - Run `python main.py` in backend folder
3. **Test Procurement** - Use the Lab Procurement feature in the frontend
4. **Set up Ollama** (Optional) - For local AI processing

The procurement feature will work with any configured LLM provider and provides intelligent vendor recommendations with cost analysis!
