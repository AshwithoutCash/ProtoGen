# Proto-Gen Quick Start Guide

Get up and running with Proto-Gen in 5 minutes!

## Prerequisites Checklist

- [ ] Python 3.9+ installed
- [ ] Node.js 16+ installed
- [ ] Free Gemini API key (recommended) or OpenAI/Anthropic key

## Quick Setup (Windows)

### 1. Get Your FREE API Key

**🎉 Option A: Google Gemini (FREE - Recommended!)**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your key (starts with `AIzaSy`)
5. **No credit card required!**

**Option B: OpenAI (Paid)**
1. Go to https://platform.openai.com/
2. Create account and add payment method
3. Go to API Keys section
4. Create new key → Copy it!

**Option C: Anthropic (Paid)**
1. Go to https://console.anthropic.com/
2. Create account and add payment method
3. Go to API Keys
4. Create new key → Copy it!

### 2. Configure Backend

```bash
cd backend
copy .env.example .env
notepad .env
```

Paste your API key:
```
# For Gemini (FREE)
GEMINI_API_KEY=AIzaSy-your-key-here

# OR for OpenAI
OPENAI_API_KEY=sk-your-key-here
```

Save and close.

### 3. Start Backend

**Option A: Using Batch Script (Easiest)**
```bash
cd ..
start-backend.bat
```

**Option B: Manual**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

✅ Backend running at http://localhost:8000

### 4. Start Frontend (New Terminal)

**Option A: Using Batch Script (Easiest)**
```bash
start-frontend.bat
```

**Option B: Manual**
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at http://localhost:5173

### 5. Open Browser

Navigate to: http://localhost:5173

🎉 **You're ready to go!**

---

## First Protocol

### Try This Example:

1. Click **"Generate Protocol"**
2. Fill in:
   - **Goal**: Amplify GAPDH gene for cloning
   - **Technique**: PCR
   - **Reagents**: Q5 Polymerase
   - **Template**: Human genomic DNA, 50 ng/µL
   - **Amplicon Size**: 700 bp
3. Click **"Generate Protocol"**
4. Wait 5-10 seconds
5. View your protocol!

---

## Troubleshooting

### Backend won't start?

**Check Python version:**
```bash
python --version
```
Should be 3.9 or higher.

**Missing modules?**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend won't start?

**Check Node version:**
```bash
node --version
```
Should be 16 or higher.

**Dependencies not installed?**
```bash
cd frontend
npm install
```

### "No LLM providers available" error?

1. Check your `.env` file exists in `backend/` folder
2. Verify API key is correct (no extra spaces)
3. Test API key at provider's website
4. Restart backend server

### Can't connect to backend?

1. Make sure backend is running (check terminal)
2. Backend should show: "Uvicorn running on http://0.0.0.0:8000"
3. Try accessing: http://localhost:8000/docs
4. Check firewall isn't blocking port 8000

---

## Common Commands

### Backend

```bash
# Start backend
cd backend
venv\Scripts\activate
python main.py

# Install new dependency
pip install package-name
pip freeze > requirements.txt

# Check API docs
# Visit: http://localhost:8000/docs
```

### Frontend

```bash
# Start frontend
cd frontend
npm run dev

# Build for production
npm run build

# Install new package
npm install package-name
```

---

## Next Steps

1. ✅ Generate your first protocol
2. ✅ Try troubleshooting a problem
3. ✅ Explore different techniques
4. 📖 Read `EXAMPLES.md` for more examples
5. 📖 Check `API_DOCUMENTATION.md` for API details
6. 🔧 Customize prompts in `backend/app/prompts/`

---

## Tips

💡 **Save time**: Use the batch scripts (`start-backend.bat`, `start-frontend.bat`)

💡 **Multiple terminals**: Keep backend and frontend running in separate terminals

💡 **API costs**: Each protocol generation costs ~$0.01-0.05 depending on complexity

💡 **Better results**: More detailed inputs = better protocols

💡 **Verify always**: Never use generated protocols without expert review

---

## Getting Help

- 📖 Full documentation in `README.md`
- 🏗️ Architecture details in `ARCHITECTURE.md`
- 🔧 Detailed setup in `SETUP_GUIDE.md`
- 📝 Usage examples in `EXAMPLES.md`
- 🌐 API docs at http://localhost:8000/docs

---

## Stopping the Application

1. **Backend**: Press `Ctrl+C` in backend terminal
2. **Frontend**: Press `Ctrl+C` in frontend terminal

---

## Quick Reference

| What | Where | Port |
|------|-------|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:8000 | 8000 |
| API Docs | http://localhost:8000/docs | 8000 |
| Backend Code | `backend/` | - |
| Frontend Code | `frontend/` | - |
| Config | `backend/.env` | - |

---

**Happy Protocol Generating! 🧬🔬**
