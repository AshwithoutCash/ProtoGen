# Getting Your Free Gemini API Key

Proto-Gen now uses **Google Gemini** as the default LLM provider because it offers a **free tier** with generous limits!

## Why Gemini?

- ✅ **Free tier available** - No credit card required
- ✅ **Generous limits** - 60 requests per minute
- ✅ **High quality** - Gemini 1.5 Flash is fast and capable
- ✅ **Easy to get** - Simple signup process

## Step-by-Step Guide

### 1. Go to Google AI Studio

Visit: **https://makersuite.google.com/app/apikey**

Or: **https://aistudio.google.com/app/apikey**

### 2. Sign In

- Sign in with your Google account
- If you don't have one, create a free Google account

### 3. Create API Key

1. Click **"Create API Key"** button
2. Choose **"Create API key in new project"** (recommended for first time)
3. Your API key will be generated instantly!

### 4. Copy Your API Key

- Click the **copy icon** next to your API key
- It will look like: `AIzaSyC...` (starts with `AIzaSy`)
- **Important**: Save this key securely!

### 5. Add to Proto-Gen

1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```

2. Create `.env` file from example:
   ```bash
   copy .env.example .env
   ```

3. Open `.env` in a text editor:
   ```bash
   notepad .env
   ```

4. Add your Gemini API key:
   ```
   GEMINI_API_KEY=AIzaSyC_your_actual_key_here
   ```

5. Save and close the file

### 6. Start Proto-Gen

```bash
# Start backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py

# In a new terminal, start frontend
cd frontend
npm install
npm run dev
```

### 7. Verify It Works

1. Open http://localhost:5173
2. Go to "Generate Protocol"
3. Fill in a simple example
4. Click "Generate Protocol"
5. You should see a protocol generated in 5-10 seconds!

## Free Tier Limits

**Gemini 1.5 Flash (Free Tier):**
- **60 requests per minute**
- **1,500 requests per day**
- **1 million requests per month**

This is more than enough for personal use and testing!

## Troubleshooting

### "Invalid API key" error

**Solution:**
1. Check that your API key starts with `AIzaSy`
2. Make sure there are no extra spaces in the `.env` file
3. Verify the key is correct (copy it again from Google AI Studio)
4. Restart the backend server

### "Rate limit exceeded"

**Solution:**
- You've hit the free tier limit
- Wait a minute and try again
- The limits reset every minute

### "API key not found"

**Solution:**
1. Make sure `.env` file exists in the `backend` folder
2. Check that `GEMINI_API_KEY` is spelled correctly
3. Restart the backend server after adding the key

## Comparing Providers

| Feature | Gemini (Free) | OpenAI | Anthropic |
|---------|---------------|--------|-----------|
| **Cost** | FREE | Paid | Paid |
| **Signup** | Google account | Credit card required | Credit card required |
| **Rate Limit** | 60/min | 3-60/min (varies) | Varies by plan |
| **Quality** | Excellent | Excellent | Excellent |
| **Speed** | Very fast | Fast | Fast |

## Using Multiple Providers

You can configure multiple API keys in `.env`:

```
# Use Gemini as primary (free)
GEMINI_API_KEY=AIzaSyC_your_gemini_key

# Optional: Add others as backup
OPENAI_API_KEY=sk-your_openai_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
```

Proto-Gen will automatically use Gemini first, and fall back to others if needed.

## Model Information

**Default Model**: `gemini-1.5-flash`
- Fast response times
- Good quality outputs
- Perfect for protocol generation

**Alternative**: `gemini-1.5-pro` (also free, but slower)
- Higher quality
- Better for complex tasks
- Can be configured in `llm_service.py`

## Security Tips

1. **Never share your API key** publicly
2. **Don't commit `.env` to git** (already in `.gitignore`)
3. **Regenerate key** if accidentally exposed
4. **Use separate keys** for different projects

## Getting Help

If you have issues:

1. Verify your API key at: https://aistudio.google.com/app/apikey
2. Check the backend terminal for error messages
3. Review `TROUBLESHOOTING.md` for common issues
4. Make sure you've restarted the backend after adding the key

## Additional Resources

- **Google AI Studio**: https://aistudio.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Rate Limits**: https://ai.google.dev/gemini-api/docs/rate-limits

---

**That's it!** You now have a completely free AI-powered protocol assistant. 🎉

No credit card required, no trial period - just free, high-quality protocol generation!
