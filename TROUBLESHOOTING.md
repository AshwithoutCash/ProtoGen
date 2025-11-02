# Proto-Gen Troubleshooting Guide

This guide helps you resolve common issues when setting up or using Proto-Gen.

## Table of Contents
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [API Issues](#api-issues)
- [LLM Provider Issues](#llm-provider-issues)
- [General Issues](#general-issues)

---

## Backend Issues

### Issue: "python: command not found"

**Cause:** Python is not installed or not in PATH

**Solution:**
1. Download Python from https://www.python.org/downloads/
2. Install Python 3.9 or higher
3. During installation, check "Add Python to PATH"
4. Restart terminal
5. Verify: `python --version`

---

### Issue: "No module named 'fastapi'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

---

### Issue: "ModuleNotFoundError: No module named 'app'"

**Cause:** Running from wrong directory or virtual environment not activated

**Solution:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

Make sure you're in the `backend` directory when running `python main.py`.

---

### Issue: Port 8000 already in use

**Cause:** Another process is using port 8000

**Solution Option 1 - Change Port:**
Edit `backend/.env`:
```
PORT=8001
```

**Solution Option 2 - Kill Process:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Find the PID from netstat output and kill it
```

---

### Issue: "No .env file found"

**Cause:** Environment file not created

**Solution:**
```bash
cd backend
copy .env.example .env
notepad .env
# Add your API keys
```

---

### Issue: Virtual environment activation fails

**Cause:** Execution policy on Windows

**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again
cd backend
venv\Scripts\activate
```

---

## Frontend Issues

### Issue: "npm: command not found"

**Cause:** Node.js not installed

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install LTS version (16+)
3. Restart terminal
4. Verify: `node --version` and `npm --version`

---

### Issue: "npm install" fails with errors

**Cause:** npm cache corruption or network issues

**Solution:**
```bash
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "Module not found" errors in browser console

**Cause:** Dependencies not installed or build issue

**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

### Issue: Blank page in browser

**Cause:** JavaScript errors or backend not running

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify backend is running at http://localhost:8000
4. Check network tab for failed API calls
5. Clear browser cache and reload

---

### Issue: "Failed to fetch" errors

**Cause:** Backend not running or CORS issue

**Solution:**
1. Verify backend is running: http://localhost:8000/docs
2. Check `backend/.env` has correct CORS_ORIGINS:
   ```
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```
3. Restart backend after changing .env

---

### Issue: Styles not loading (page looks unstyled)

**Cause:** TailwindCSS not building properly

**Solution:**
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

---

## API Issues

### Issue: "No LLM providers are available"

**Cause:** No valid API keys configured

**Solution:**
1. Check `backend/.env` exists
2. Verify API key format:
   - OpenAI: starts with `sk-`
   - Anthropic: starts with `sk-ant-`
3. No extra spaces or quotes around keys
4. Restart backend after adding keys

**Example .env:**
```
OPENAI_API_KEY=sk-proj-abc123...
ANTHROPIC_API_KEY=sk-ant-xyz789...
```

---

### Issue: "Rate limit exceeded"

**Cause:** Too many API requests to LLM provider

**Solution:**
1. Wait a few minutes
2. Check your API usage at provider dashboard
3. Upgrade API plan if needed
4. Implement request throttling

---

### Issue: "Invalid API key"

**Cause:** API key is incorrect or expired

**Solution:**
1. Go to provider website (OpenAI/Anthropic)
2. Generate new API key
3. Update `backend/.env`
4. Restart backend
5. Test at http://localhost:8000/api/v1/health

---

### Issue: Slow response times (>30 seconds)

**Cause:** LLM provider latency or complex request

**Solution:**
1. Check internet connection
2. Try simpler request first
3. Check provider status page
4. Consider using different provider
5. Reduce `max_tokens` in `llm_service.py` if needed

---

## LLM Provider Issues

### OpenAI Issues

**Issue: "You exceeded your current quota"**

**Cause:** No credits in OpenAI account

**Solution:**
1. Go to https://platform.openai.com/account/billing
2. Add payment method
3. Add credits
4. Wait a few minutes for activation

---

**Issue: "Model not found"**

**Cause:** Using unavailable model

**Solution:**
Edit `backend/app/services/llm_service.py`:
```python
# Change model in generate_with_openai method
model="gpt-3.5-turbo"  # Instead of gpt-4
```

---

### Anthropic Issues

**Issue: "Authentication failed"**

**Cause:** Invalid Anthropic API key

**Solution:**
1. Go to https://console.anthropic.com/
2. Check API key is active
3. Generate new key if needed
4. Update `backend/.env`

---

## General Issues

### Issue: Changes not reflecting

**Cause:** Cache or server not restarting

**Solution:**

**Backend changes:**
- Stop backend (Ctrl+C)
- Restart: `python main.py`

**Frontend changes:**
- Should auto-reload
- If not, stop (Ctrl+C) and restart: `npm run dev`
- Clear browser cache (Ctrl+Shift+R)

**Environment changes:**
- Always restart backend after changing `.env`

---

### Issue: "CORS policy" errors in browser

**Cause:** CORS not configured properly

**Solution:**
1. Check `backend/.env`:
   ```
   CORS_ORIGINS=http://localhost:5173
   ```
2. Restart backend
3. Clear browser cache

---

### Issue: Can't access http://localhost:8000/docs

**Cause:** Backend not running or wrong port

**Solution:**
1. Check backend terminal for errors
2. Verify backend started successfully
3. Look for message: "Uvicorn running on http://0.0.0.0:8000"
4. Try http://127.0.0.1:8000/docs instead

---

### Issue: Protocol generation returns empty or error

**Cause:** LLM API issue or invalid input

**Solution:**
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify all required fields filled
4. Try simpler input first
5. Check API key has credits
6. Test with different LLM provider

---

### Issue: Firewall blocking connections

**Cause:** Windows Firewall or antivirus

**Solution:**
1. Allow Python and Node.js through firewall
2. Temporarily disable antivirus to test
3. Add exceptions for ports 8000 and 5173

---

## Debugging Tips

### Enable Verbose Logging

**Backend:**
Edit `backend/main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
Check browser console (F12) → Console tab

---

### Test API Directly

Use the interactive docs:
```
http://localhost:8000/docs
```

Try the `/health` endpoint first to verify backend is working.

---

### Check API Response

Use browser Network tab (F12 → Network):
1. Perform action in UI
2. Check network requests
3. Look at request/response details
4. Check for error messages

---

### Verify Environment

**Backend:**
```bash
cd backend
venv\Scripts\activate
python -c "from app.core.config import settings; print(settings.openai_api_key[:10])"
```

Should print first 10 characters of your API key.

---

### Test LLM Connection

Create `backend/test_llm.py`:
```python
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

Run: `python test_llm.py`

---

## Still Having Issues?

### Checklist

- [ ] Python 3.9+ installed
- [ ] Node.js 16+ installed
- [ ] Virtual environment activated (backend)
- [ ] Dependencies installed (both backend and frontend)
- [ ] `.env` file created with valid API keys
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] No firewall blocking connections
- [ ] API keys have credits/quota
- [ ] Browser cache cleared

### Getting More Help

1. **Check Error Messages**: Read the full error message carefully
2. **Check Logs**: Look at both backend terminal and browser console
3. **Test Components**: Test backend and frontend separately
4. **Simplify**: Try with minimal input first
5. **Documentation**: Review relevant docs in the project

### Useful Commands

```bash
# Check versions
python --version
node --version
npm --version

# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Check backend health
curl http://localhost:8000/api/v1/health

# View backend logs
cd backend
python main.py

# View frontend logs
cd frontend
npm run dev
```

---

## Common Error Messages

| Error | Likely Cause | Quick Fix |
|-------|--------------|-----------|
| "No module named..." | Dependencies not installed | `pip install -r requirements.txt` |
| "npm ERR!" | npm issue | `npm cache clean --force && npm install` |
| "CORS policy" | Backend not configured | Check CORS_ORIGINS in .env |
| "Rate limit" | Too many API calls | Wait or upgrade plan |
| "Invalid API key" | Wrong key | Check key in .env |
| "Port in use" | Port already taken | Change port or kill process |
| "Connection refused" | Backend not running | Start backend |

---

**Remember:** Most issues are due to:
1. Missing dependencies
2. Wrong directory
3. API key issues
4. Backend not running
5. Port conflicts

Always check these first! 🔍
