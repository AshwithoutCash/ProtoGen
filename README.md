# Proto-Gen - The AI Lab Protocol Assistant

An intelligent laboratory protocol generation and troubleshooting assistant powered by Large Language Models.

## Features

- **Protocol Generation**: Generate detailed, step-by-step laboratory protocols for common molecular biology techniques
- **Protocol Troubleshooting**: Analyze failed experiments and get ranked suggestions for fixes
- **Multiple LLM Support**: Flexible backend supporting OpenAI, Anthropic, and other LLM providers
- **Modern UI**: Clean, intuitive interface built with React and TailwindCSS

## Project Structure

```
ProtoGen/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── prompts/        # LLM prompt templates
│   ├── requirements.txt
│   └── main.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── utils/         # Utilities
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your API key:
   ```
   # Get FREE Gemini API key at: https://makersuite.google.com/app/apikey
   GEMINI_API_KEY=your_gemini_key_here
   
   # Optional: Add other providers
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```
   
   **NEW: Gemini is FREE!** See [GEMINI_SETUP.md](GEMINI_SETUP.md) for detailed instructions.

5. Run the backend:
   ```bash
   python main.py
   ```

The backend will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## Deployment

### Deploy to Vercel

1. **Fork this repository** to your GitHub account
2. **Get a free Gemini API key** at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Deploy to Vercel**:
   - Connect your GitHub[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AshwithoutCash/ProtoGen)
   - Add environment variable: `GEMINI_API_KEY=your_key_here`
   - Deploy!

Your app will be live in minutes!

## Usage

### Generating a Protocol

1. Select "Generate Protocol" from the main menu
2. Fill in the required fields:
   - Experimental Goal
   - Core Technique (PCR, qPCR, Gibson Assembly, etc.)
   - Key Reagents/Enzymes
   - Template Details
   - Primer/DNA Fragment Details
3. Click "Generate Protocol"
4. Review the generated protocol with calculated volumes and step-by-step instructions

### Troubleshooting a Protocol

1. Select "Troubleshoot Protocol" from the main menu
2. Paste your original protocol
3. Describe the observed problem
4. Optionally upload a gel image or other result data
5. Click "Analyze Problem"
6. Review the ranked list of potential causes and solutions

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Supported Techniques

- PCR (Polymerase Chain Reaction)
- qPCR (Quantitative PCR)
- Gibson Assembly
- Miniprep (Plasmid DNA Extraction)
- Gel Electrophoresis
- Restriction Digestion
- Ligation
- Transformation
- And more...

## Safety Disclaimer

**Important**: This tool is an assistant and is not a substitute for expert scientific review. Always verify protocols and calculations before performing experiments. Consult with experienced researchers and follow your institution's safety guidelines.

## Technology Stack

- **Backend**: FastAPI, Python 3.9+
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui
- **LLM Integration**: OpenAI API, Anthropic API
- **Styling**: TailwindCSS, Lucide Icons

## License

MIT License
