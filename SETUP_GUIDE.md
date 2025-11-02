# Proto-Gen Setup Guide

This guide will walk you through setting up Proto-Gen on your local machine.

## Prerequisites

- **Python 3.9 or higher**
- **Node.js 16 or higher**
- **npm or yarn**
- **API Keys** for at least one LLM provider:
  - OpenAI API Key (recommended)
  - Anthropic API Key (optional)

## Step-by-Step Setup

### 1. Clone or Download the Project

If you haven't already, navigate to the ProtoGen directory:

```bash
cd c:/Documents/Achalan/ProtoGen
```

### 2. Backend Setup

#### 2.1. Navigate to Backend Directory

```bash
cd backend
```

#### 2.2. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Edit the `.env` file and add your API keys:
   ```
   OPENAI_API_KEY=sk-your-openai-key-here
   ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
   ```

   **Note:** You need at least one API key. If you only have OpenAI, that's fine!

#### 2.5. Start the Backend Server

```bash
python main.py
```

The backend should now be running on `http://localhost:8000`

You can verify by visiting: `http://localhost:8000/docs` (FastAPI interactive documentation)

### 3. Frontend Setup

Open a **new terminal window** (keep the backend running).

#### 3.1. Navigate to Frontend Directory

```bash
cd c:/Documents/Achalan/ProtoGen/frontend
```

#### 3.2. Install Dependencies

```bash
npm install
```

This may take a few minutes.

#### 3.3. Start the Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

### 4. Access the Application

Open your web browser and navigate to:

```
http://localhost:5173
```

You should see the Proto-Gen homepage!

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError` when starting backend

**Solution:** Make sure you activated the virtual environment and installed all dependencies:
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

---

**Problem:** `API key not found` error

**Solution:** Check that your `.env` file exists in the `backend` directory and contains valid API keys.

---

**Problem:** Port 8000 already in use

**Solution:** Either stop the process using port 8000, or change the port in `backend/.env`:
```
PORT=8001
```

### Frontend Issues

**Problem:** `npm install` fails

**Solution:** Try clearing npm cache and reinstalling:
```bash
npm cache clean --force
npm install
```

---

**Problem:** Port 5173 already in use

**Solution:** The Vite dev server will automatically try the next available port (5174, 5175, etc.)

---

**Problem:** API calls failing with CORS errors

**Solution:** Make sure the backend is running and check that `CORS_ORIGINS` in `backend/.env` includes `http://localhost:5173`

### API Key Issues

**Problem:** "No LLM providers are available" error

**Solution:** 
1. Verify your API key is correctly set in `backend/.env`
2. Check that the API key is valid by testing it directly with the provider
3. For OpenAI keys, make sure they start with `sk-`
4. For Anthropic keys, make sure they start with `sk-ant-`

## Getting API Keys

### OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (you won't be able to see it again!)

### Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy the key

## Next Steps

Once everything is running:

1. **Generate a Protocol**: Click "Generate" in the navigation and fill out the form
2. **Troubleshoot**: Click "Troubleshoot" to analyze a failed experiment
3. **Explore**: Try different techniques and parameters

## Development Tips

- The backend auto-reloads when you make changes to Python files
- The frontend auto-reloads when you make changes to React files
- Check the browser console (F12) for frontend errors
- Check the terminal for backend errors
- API documentation is available at `http://localhost:8000/docs`

## Production Deployment

For production deployment, see `DEPLOYMENT.md` (coming soon).

## Need Help?

If you encounter issues not covered here, please:
1. Check the console/terminal for error messages
2. Verify all prerequisites are installed
3. Ensure API keys are valid and have sufficient credits
