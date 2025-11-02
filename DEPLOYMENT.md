# 🚀 Proto-Gen Deployment Guide

This guide will help you deploy Proto-Gen to Vercel with both frontend and backend.

## 📋 Prerequisites

1. **GitHub Account** - To store your code
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Gemini API Key** - Get free key at [makersuite.google.com](https://makersuite.google.com/app/apikey)

## 🔧 Setup Steps

### 1. Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Proto-Gen with Route-Gen feature"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/proto-gen.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub account
   - Select your `proto-gen` repository

2. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (monorepo setup)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

3. **Set Environment Variables**:
   In Vercel dashboard → Settings → Environment Variables, add:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   OPENAI_API_KEY=your_openai_key_here (optional)
   ANTHROPIC_API_KEY=your_anthropic_key_here (optional)
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app-name.vercel.app`

## 🔄 Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

## 🌐 Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS settings as instructed

## 🛠️ Environment Variables

### Required:
- `GEMINI_API_KEY` - Your free Gemini API key

### Optional:
- `OPENAI_API_KEY` - For OpenAI GPT models
- `ANTHROPIC_API_KEY` - For Claude models

## 📁 Project Structure

```
proto-gen/
├── frontend/          # React frontend
├── backend/           # FastAPI backend
├── vercel.json        # Vercel configuration
├── requirements.txt   # Python dependencies
└── DEPLOYMENT.md      # This file
```

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `frontend/package.json`
- Ensure `frontend/dist` folder is created during build

### API Not Working
- Verify environment variables are set in Vercel
- Check API routes start with `/api/`
- Ensure backend dependencies are in root `requirements.txt`

### CORS Issues
- Frontend and backend are on same domain in production
- No CORS configuration needed for Vercel deployment

## 🎉 Success!

Your Proto-Gen app should now be live with:
- ✅ Frontend React app
- ✅ Backend FastAPI server
- ✅ Route-Gen experiment planner
- ✅ Protocol generation
- ✅ Troubleshooting features
- ✅ Free Gemini AI integration

Visit your deployed app and start generating protocols! 🧬🔬
