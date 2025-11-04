<div align="center">

# 🧬 Proto-Gen - Complete AI Laboratory Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18.0+-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-00a393.svg)](https://fastapi.tiangolo.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-ff6b6b.svg)](https://github.com/AshwithoutCash/ProtoGen)
[![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange.svg)](https://firebase.google.com/)

**🚀 A comprehensive AI-powered laboratory management suite with protocol generation, troubleshooting, inventory management, procurement assistance, and experimental planning**

*Accelerating research through intelligent automation* 🔬✨

[🎯 Features](#-features) • [🏗️ Architecture](#️-architecture) • [⚡ Quick Start](#-quick-start) • [📚 Complete Guide](#-complete-guide) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Complete Feature Suite

### 🧪 **Core Laboratory Features**

<table>
<tr>
<td width="33%">

#### **Protocol Generation**
- 🔬 **11+ Laboratory Techniques**
  - PCR & qPCR
  - Gibson Assembly
  - Miniprep & DNA Extraction
  - Gel Electrophoresis
  - Restriction Digestion & Ligation
  - Transformation
  - Western Blot & ELISA
- 📋 **Detailed Instructions**
- 🧮 **Automatic Calculations**
- ⚙️ **Equipment Settings**
- 📝 **Materials Lists**
- ⚠️ **Safety Guidelines**

</td>
<td width="33%">

#### **Protocol Troubleshooting**
- 🎯 **AI Problem Analysis**
- 📊 **Ranked Solutions**
- 🧠 **Expert Reasoning**
- ✅ **Verification Checklists**
- 🔄 **Iterative Solving**
- 📈 **Success Optimization**
- 🖼️ **Image Analysis** (planned)
- 📝 **Detailed Reports**

</td>
<td width="33%">

#### **Experimental Planning**
- 🗺️ **Route Generation**
- 📊 **Pathway Analysis**
- 🔬 **Method Optimization**
- 📅 **Timeline Planning**
- 🎯 **Goal Setting**
- 📈 **Success Metrics**
- 🔄 **Alternative Routes**
- 📋 **Resource Planning**

</td>
</tr>
</table>

### 🏢 **Laboratory Management Suite**

<table>
<tr>
<td width="50%">

#### **📦 Inventory Management (IMS-Gen)**
- 📊 **Real-time Stock Tracking**
- 🔍 **Intelligent Search & Filtering**
- 🚨 **Low Stock Alerts**
- 📧 **Email Notifications**
- 🤖 **Llama LLM Data Processing**
- 📱 **CSV/Excel Import**
- 🔥 **Firebase Cloud Storage**
- 📈 **Usage Analytics**
- 🏷️ **Barcode Support** (planned)

#### **🛒 Procurement Assistant (Procure-Gen)**
- 💰 **Vendor Price Comparison**
- 🎯 **Preferred Brand Matching**
- 📊 **Cost Analysis & Savings**
- 🔗 **Real-time Availability**
- 📋 **Purchase Recommendations**
- 💳 **Budget Management**
- 📦 **Order Tracking** (planned)
- 🤝 **Supplier Integration**

</td>
<td width="50%">

#### **🔧 Laboratory Tools & Diagnostics**
- 🛠️ **Equipment Recommendations**
- 📏 **Measurement Tools**
- 🧪 **Reagent Calculators**
- 🔬 **Instrument Guides**
- ⚙️ **Maintenance Schedules**
- 📊 **Performance Monitoring**
- 🚨 **Diagnostic Alerts**
- 📱 **Mobile Compatibility**

#### **🔥 Firebase Integration**
- 👤 **User Authentication**
- 💾 **Data Persistence**
- 📊 **User Dashboards**
- 📋 **Save & Bookmark System**
- 🔒 **Secure Data Storage**
- 📱 **Cross-device Sync**
- 📈 **Usage Analytics**
- 🔄 **Real-time Updates**

</td>
</tr>
</table>

### 🤖 **AI & Integration Features**
- 💎 **Google Gemini** (FREE - Primary)
- 🤖 **OpenAI GPT-4** (Premium)
- 🎭 **Anthropic Claude** (Premium)
- 🦙 **Llama LLM** (Local Processing)
- 🔗 **n8n Workflow Integration**
- 📧 **Gmail Email Automation**
- 🌐 **Webhook Support**
- 📊 **Real-time Processing**

---

## 🏗️ Complete System Architecture

### 📊 **System Overview**

```mermaid
graph TB
    subgraph "🌐 Frontend Layer (React + Firebase)"
        A[🏠 Dashboard] --> D[🔄 API Client]
        B[🧪 Protocol Generator] --> D
        C[🔍 Troubleshooter] --> D
        E[🗺️ Route Planner] --> D
        F[🔧 Tools & Diagnostics] --> D
        G[📦 Inventory Manager] --> D
        H[🛒 Procurement Assistant] --> D
        I[🔥 Firebase Auth] --> D
        D --> J[📱 React UI Components]
    end
    
    subgraph "⚡ Backend Layer (FastAPI + Python)"
        K[🛣️ FastAPI Routes] --> L[🔧 Protocol Service]
        K --> M[📦 Inventory Service]
        K --> N[🛒 Procurement Service]
        K --> O[🗺️ Route Service]
        L --> P[🤖 LLM Service]
        M --> P
        N --> P
        O --> P
        P --> Q[📝 Prompt Templates]
    end
    
    subgraph "🧠 AI Providers"
        R[💎 Google Gemini - FREE]
        S[🤖 OpenAI GPT-4]
        T[🎭 Anthropic Claude]
        U[🦙 Llama Local]
    end
    
    subgraph "🔥 Firebase Services"
        V[👤 Authentication]
        W[📊 Firestore Database]
        X[📱 Real-time Updates]
    end
    
    subgraph "🔗 External Integrations"
        Y[📧 Gmail/n8n Webhooks]
        Z[🛒 Vendor APIs]
        AA[📊 Analytics]
    end
    
    D -.->|HTTP/REST| K
    P -.->|API Calls| R
    P -.->|API Calls| S
    P -.->|API Calls| T
    P -.->|Local| U
    I -.->|Auth| V
    D -.->|Data| W
    M -.->|Alerts| Y
    N -.->|Pricing| Z
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style K fill:#fff8e1
    style L fill:#fce4ec
    style P fill:#f1f8e9
    style Q fill:#e3f2fd
    style R fill:#4caf50
    style S fill:#ff6b6b
    style T fill:#4ecdc4
    style U fill:#45b7d1
    style V fill:#ff9800
    style W fill:#ff9800
```

### 🔄 **Complete Data Flow**

```mermaid
sequenceDiagram
    participant 👤 User
    participant 🌐 Frontend
    participant 🔥 Firebase
    participant ⚡ Backend
    participant 🤖 LLM Service
    participant 🧠 AI Provider
    participant 📧 External APIs
    
    👤 User->>🌐 Frontend: 🔐 Authenticate
    🌐 Frontend->>🔥 Firebase: 👤 Verify User
    🔥 Firebase->>🌐 Frontend: ✅ User Profile
    
    👤 User->>🌐 Frontend: 📝 Generate Protocol
    🌐 Frontend->>⚡ Backend: 📤 POST /api/v1/generate
    ⚡ Backend->>⚡ Backend: ✅ Validate Request
    ⚡ Backend->>🤖 LLM Service: 🔧 Process Request
    🤖 LLM Service->>🧠 AI Provider: 🚀 Send Prompt
    🧠 AI Provider->>🤖 LLM Service: 📋 Return Protocol
    🤖 LLM Service->>⚡ Backend: 📄 Formatted Response
    ⚡ Backend->>🌐 Frontend: 📊 JSON Response
    🌐 Frontend->>👤 User: 🎉 Display Protocol
    
    👤 User->>🌐 Frontend: 💾 Save Protocol
    🌐 Frontend->>🔥 Firebase: 📊 Store Data
    
    👤 User->>🌐 Frontend: 📦 Check Inventory
    🌐 Frontend->>⚡ Backend: 📤 POST /api/v1/inventory
    ⚡ Backend->>🔥 Firebase: 📊 Query Database
    
    👤 User->>🌐 Frontend: 🚨 Send Alert
    🌐 Frontend->>📧 External APIs: 📧 Email Notification
```

### 💾 **Technology Stack**

```mermaid
mindmap
  root((🚀 Proto-Gen Suite))
    🎨 Frontend
      ⚛️ React 18
      ⚡ Vite
      🎨 TailwindCSS
      🧭 React Router
      📡 Axios
      📝 React Markdown
      🎯 Lucide Icons
      🔥 Firebase SDK
    ⚙️ Backend
      🚀 FastAPI
      🐍 Python 3.9+
      ✅ Pydantic
      🦄 Uvicorn
      🔧 Python Multipart
      📊 Pandas (Data Processing)
      🔥 Firebase Admin SDK
    🤖 AI Integration
      💎 Google Gemini (FREE)
      🤖 OpenAI GPT-4
      🎭 Anthropic Claude
      🦙 Llama Local LLM
      📝 Custom Prompts
    🔥 Firebase Services
      👤 Authentication
      📊 Firestore Database
      🔒 Security Rules
      📱 Real-time Updates
    🔗 External Services
      📧 Gmail API
      🔗 n8n Webhooks
      🛒 Vendor APIs
      📊 Analytics
    🛠️ Development
      📦 npm/pip
      🔧 Vite Dev Server
      📚 Interactive Docs
      🧪 Type Safety
      🐳 Docker Support
```

---

## ⚡ Complete Setup Guide

### 🚀 **One-Click Quick Start**

```bash
# 📥 Clone the repository
git clone https://github.com/AshwithoutCash/ProtoGen.git
cd ProtoGen

# 🔧 Backend Setup (Terminal 1)
cd backend
python -m venv venv
venv\Scripts\activate  # Windows (use source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt

# 🔑 Configure API Keys (REQUIRED)
copy .env.example .env
# Edit .env with your API keys (see below)

# 🚀 Start Backend
python main.py

# 🎨 Frontend Setup (Terminal 2)
cd ../frontend
npm install
npm run dev
```

### 🔑 **API Key Configuration (Choose One)**

Create a `.env` file in the `backend` directory:

#### **Option A: Google Gemini (FREE - Recommended) 💎**
```env
# Get FREE API key at: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSy_your_gemini_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173
```

#### **Option B: OpenAI (Paid) 🤖**
```env
OPENAI_API_KEY=sk-your_openai_key_here
```

#### **Option C: Anthropic (Paid) 🎭**
```env
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
```

#### **Option D: Multiple Providers (Recommended for Production)**
```env
# Primary (FREE)
GEMINI_API_KEY=AIzaSy_your_gemini_key_here

# Backup providers
OPENAI_API_KEY=sk-your_openai_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here

# Firebase (Optional - for user accounts & data persistence)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

### 🎯 **Access Points**

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Main Application** | http://localhost:5173 | Complete laboratory suite |
| ⚡ **Backend API** | http://localhost:8000 | REST API endpoints |
| 📚 **API Documentation** | http://localhost:8000/docs | Interactive API docs |
| 🔍 **Health Check** | http://localhost:8000/health | Service status |

---

## 📖 Complete Usage Guide

### 🧪 **Protocol Generation**

1. **Navigate** to Protocol Generator
2. **Select Technique**: PCR, qPCR, Gibson Assembly, etc.
3. **Fill Details**:
   - Experimental Goal
   - Reagents & Enzymes
   - Template Information
   - Reaction Parameters
4. **Generate**: Get detailed protocol in 5-10 seconds
5. **Save**: Store to Firebase for future reference

### 🔍 **Protocol Troubleshooting**

1. **Describe Problem**: "No PCR band visible on gel"
2. **Paste Protocol**: Your original protocol
3. **Add Details**: Reagent ages, observations
4. **Analyze**: Get ranked solutions with explanations
5. **Follow Checklist**: Verification steps provided

### 📦 **Inventory Management (IMS-Gen)**

1. **Upload Data**: CSV/Excel files with inventory
2. **AI Processing**: Llama LLM normalizes data
3. **View Inventory**: Searchable table with stock levels
4. **Low Stock Alerts**: Automatic detection & email notifications
5. **Firebase Sync**: Cloud storage with real-time updates

### 🛒 **Procurement Assistant (Procure-Gen)**

1. **List Materials**: What you need to purchase
2. **Set Preferences**: Brands, budget, urgency
3. **AI Analysis**: Multi-vendor price comparison
4. **Get Recommendations**: Best deals with cost analysis
5. **Purchase Links**: Direct vendor product pages

### 🗺️ **Experimental Route Planning**

1. **Define Goal**: Research objective
2. **Set Constraints**: Time, resources, equipment
3. **Generate Routes**: Multiple experimental pathways
4. **Compare Options**: Success rates, timelines, costs
5. **Optimize**: AI-suggested improvements

### 🔧 **Laboratory Tools & Diagnostics**

1. **Equipment Recommendations**: Based on your needs
2. **Measurement Tools**: Calculators and converters
3. **Maintenance Schedules**: Equipment care reminders
4. **Performance Monitoring**: Track instrument efficiency
5. **Diagnostic Alerts**: Proactive issue detection

---

## 🔥 Firebase Integration Setup

### **User Authentication & Data Persistence**

1. **Create Firebase Project**:
   ```bash
   # Go to https://console.firebase.google.com
   # Create new project: "proto-gen-lab"
   # Enable Authentication (Email/Password + Google)
   # Create Firestore Database
   ```

2. **Configure Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // User bookmarks and saved results
       match /users/{userId}/{collection}/{docId} {
         allow read, write, delete: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

3. **Download Service Account**:
   - Project Settings → Service Accounts
   - Generate new private key
   - Save as `firebase-service-account.json` in backend folder

4. **Update Environment**:
   ```env
   FIREBASE_PROJECT_ID=proto-gen-lab
   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
   ```

### **Features Enabled with Firebase**:
- 👤 **User Accounts**: Sign up/in with email or Google
- 💾 **Save Protocols**: Persistent storage across devices
- 📊 **User Dashboard**: Personal statistics and history
- 📋 **Bookmarks**: Quick save for later reference
- 🔄 **Real-time Sync**: Updates across all devices
- 🔒 **Secure Data**: User isolation and privacy

---

## 📊 Complete API Reference

### **Core Endpoints**

#### **Health Check**
```http
GET /api/v1/health
Response: {
  "status": "healthy",
  "available_providers": ["gemini", "openai"],
  "version": "1.0.0"
}
```

#### **Protocol Generation**
```http
POST /api/v1/generate
Content-Type: application/json

{
  "experimental_goal": "Amplify GAPDH gene for cloning",
  "technique": "PCR",
  "reagents": "Q5 High-Fidelity DNA Polymerase",
  "template_details": "Human genomic DNA, 50 ng/µL",
  "primer_details": "Forward: 5'-ATGC..., Reverse: 5'-GCTA...",
  "amplicon_size": "700 bp",
  "reaction_volume": "25",
  "num_reactions": "8",
  "llm_provider": "gemini"
}
```

#### **Protocol Troubleshooting**
```http
POST /api/v1/troubleshoot
Content-Type: application/json

{
  "observed_problem": "No PCR band visible on gel, only primer dimers",
  "original_protocol": "PCR Reaction (25 µL): 12.5 µL Taq Master Mix...",
  "additional_details": "Template A260/A280 = 1.85, fresh reagents",
  "technique": "PCR",
  "llm_provider": "gemini"
}
```

#### **Inventory Management**
```http
# Upload inventory data
POST /api/v1/upload-inventory
Content-Type: multipart/form-data
file: [CSV/Excel file]

# Get all inventory
GET /api/v1/inventory

# Search inventory
POST /api/v1/inventory/search
{
  "search_term": "polymerase"
}

# Check availability
POST /api/v1/inventory/check-availability
{
  "material_name": "Q5 Polymerase",
  "required_quantity": 10
}
```

#### **Procurement Assistant**
```http
POST /api/v1/generate-procurement
Headers:
  X-Processing-Agent: ollama
  X-LLM-Backend: gemini
  X-Task-Type: procurement-search

{
  "materials_list": "Q5 Polymerase\ndNTP Mix\nPCR Tubes",
  "quantities": "50 units\n1 mL\n500 tubes",
  "preferred_brands": "Q5 Polymerase: New England Biolabs",
  "budget_limit": "$500",
  "urgency": "standard"
}
```

#### **Route Generation**
```http
POST /api/v1/routes
{
  "research_goal": "Develop CRISPR gene editing protocol",
  "constraints": "6 month timeline, $10k budget",
  "available_equipment": "PCR, gel electrophoresis, cell culture",
  "experience_level": "intermediate"
}
```

#### **Tools & Diagnostics**
```http
POST /api/v1/tools
{
  "tool_category": "measurement",
  "specific_need": "Calculate molarity for PCR primers",
  "context": "Setting up qPCR reactions"
}
```

### **Supported Laboratory Techniques**

| Technique | Code | Description |
|-----------|------|-------------|
| **PCR** | `PCR` | Polymerase Chain Reaction |
| **qPCR** | `qPCR` | Quantitative/Real-time PCR |
| **Gibson Assembly** | `Gibson Assembly` | DNA assembly method |
| **Miniprep** | `Miniprep` | Plasmid DNA extraction |
| **Gel Electrophoresis** | `Gel Electrophoresis` | DNA/protein separation |
| **Restriction Digestion** | `Restriction Digestion` | DNA cutting with enzymes |
| **Ligation** | `Ligation` | DNA joining |
| **Transformation** | `Transformation` | DNA uptake by cells |
| **Western Blot** | `Western Blot` | Protein detection |
| **ELISA** | `ELISA` | Enzyme immunoassay |
| **Other** | `Other` | Custom techniques |

---

## 🚨 Alert System & Automation

### **Low Stock Email Alerts**

The system automatically monitors inventory and sends professional HTML emails when stock levels are low:

#### **Features**:
- 🔍 **Real-time Monitoring**: Continuous stock level checking
- 📧 **HTML Email Generation**: Professional formatted alerts
- 🔗 **n8n Webhook Integration**: Automated email delivery via Gmail
- 📊 **Detailed Reports**: Complete item information with status
- 🎨 **Color-coded Alerts**: Critical (red) vs Warning (yellow)

#### **Alert Workflow**:
```mermaid
flowchart LR
    A[📊 Inventory Check] --> B{Stock Low?}
    B -->|Yes| C[🚨 Generate Alert]
    B -->|No| A
    C --> D[📧 Format HTML Email]
    D --> E[🔗 Send to n8n Webhook]
    E --> F[📬 Gmail Delivery]
    F --> G[📱 Notification Received]
```

#### **Email Format**:
- **Subject**: `ProtoGen IMS — Low Stock Alert (3 items, 1 critical)`
- **Content**: Structured table with item details, stock levels, locations
- **Actions**: Direct links to procurement recommendations

---

## 🛡️ Security & Compliance

### ⚠️ **Important Safety Disclaimer**

> **🚨 Critical Notice**: Proto-Gen is an AI assistant and **NOT a substitute** for:
> - 👨‍🔬 Expert scientific review
> - 🎓 Proper laboratory training  
> - 🏛️ Institutional safety protocols
> - 🧠 Professional judgment

### ✅ **Best Practices**

- 🔍 **Always verify** protocols with qualified professionals
- 🧪 **Test protocols** on small scales first
- 📋 **Follow institutional** safety guidelines
- 🤝 **Consult experienced** researchers
- 📊 **Monitor costs** and API usage

### 🔒 **Data Security**

- **User Isolation**: Firebase rules ensure users only access their own data
- **API Key Protection**: Environment variables, never exposed to frontend
- **Input Validation**: Pydantic models validate all requests
- **CORS Protection**: Configurable origins for production security
- **Audit Trail**: All user actions logged for transparency

### 💰 **Cost Considerations**

| Provider | 💵 Cost per Request | 📊 Recommended Use |
|----------|-------------------|-------------------|
| 💎 **Gemini** | FREE | 🎯 Primary choice for all users |
| 🤖 **OpenAI** | ~$0.01-0.05 | 🔧 Advanced features, high volume |
| 🎭 **Anthropic** | ~$0.02-0.08 | 🧠 Complex analysis, research |
| 🦙 **Llama** | FREE (Local) | 🏠 Offline use, privacy-focused |

---

## 🚀 Deployment Options

### 🌐 **Cloud Platforms**

<table>
<tr>
<td width="33%">

#### **Backend Deployment**
- 🚂 **Railway** (Recommended)
- 🎨 **Render**
- ☁️ **Google Cloud Run**
- 🌩️ **AWS Lambda**
- 🔷 **Azure Container Instances**
- 🐳 **Docker Containers**

</td>
<td width="33%">

#### **Frontend Deployment**
- 🌐 **Netlify** (Recommended)
- 📦 **GitHub Pages**
- ☁️ **AWS S3 + CloudFront**
- 🔷 **Azure Static Web Apps**
- 🌊 **Surge.sh**
- 🔥 **Firebase Hosting**

</td>
<td width="33%">

#### **Database & Services**
- 🔥 **Firebase** (Recommended)
- 📊 **MongoDB Atlas**
- 🐘 **PostgreSQL**
- 📧 **Gmail API**
- 🔗 **n8n Cloud**
- 📊 **Analytics Services**

</td>
</tr>
</table>

### 🔧 **Environment Configuration**

```yaml
# Production Environment
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info

# Security Settings
CORS_ORIGINS=https://your-domain.com
API_RATE_LIMIT=100
MAX_REQUEST_SIZE=10MB

# AI Configuration
DEFAULT_LLM_PROVIDER=gemini
FALLBACK_PROVIDER=openai
MAX_TOKENS=4000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# External Integrations
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
GMAIL_API_CREDENTIALS=./gmail-credentials.json
```

---

## 🧪 Comprehensive Testing Guide

### **Testing Checklist**

#### **Backend Testing**
- [ ] Health endpoint responds correctly
- [ ] All LLM providers configured and working
- [ ] Protocol generation with sample data
- [ ] Troubleshooting analysis functional
- [ ] Inventory upload and processing
- [ ] Procurement recommendations working
- [ ] Firebase integration (if enabled)
- [ ] Email alerts sending correctly

#### **Frontend Testing**
- [ ] Authentication flow (sign up/in/out)
- [ ] All navigation links working
- [ ] Protocol generation form validation
- [ ] Results display and formatting
- [ ] Save/bookmark functionality
- [ ] Inventory management interface
- [ ] Procurement assistant workflow
- [ ] Mobile responsiveness
- [ ] Error handling and user feedback

#### **Integration Testing**
- [ ] Frontend-backend communication
- [ ] Firebase real-time updates
- [ ] Email notification delivery
- [ ] n8n webhook integration
- [ ] Cross-browser compatibility
- [ ] Performance under load

### **Sample Test Data**

#### **Protocol Generation Test**:
```json
{
  "experimental_goal": "Amplify GAPDH gene for cloning",
  "technique": "PCR",
  "reagents": "Q5 High-Fidelity DNA Polymerase",
  "template_details": "Human genomic DNA, 50 ng/µL",
  "reaction_volume": "25",
  "num_reactions": "8"
}
```

#### **Inventory Test Data** (`test_inventory.csv`):
```csv
Material,Brand,Stock,Unit,Location,MinStock
Q5 Polymerase,NEB,50,units,Freezer A,10
Agarose,Bio-Rad,200,grams,Cabinet B,50
dNTP Mix,Thermo,5,mL,Freezer A,2
IPTG,GoldBio,1,grams,-20°C Freezer B,2
```

---

## 📊 Project Statistics & Achievements

<div align="center">

### 📈 **Codebase Metrics**

| Metric | 📊 Value | 📝 Description |
|--------|----------|----------------|
| 📁 **Total Files** | 100+ | Complete project files |
| 📝 **Lines of Code** | 15,000+ | Backend + Frontend + Config |
| 🧪 **Techniques Supported** | 11+ | Laboratory protocols |
| 🤖 **AI Providers** | 4 | Gemini, OpenAI, Anthropic, Llama |
| 📚 **Features** | 8+ | Complete laboratory suite |
| 🌍 **Languages** | 5 | Python, JavaScript, HTML, CSS, Markdown |

</div>

### 🏆 **Key Achievements**

- ✅ **Production-Ready** full-stack laboratory management suite
- ✅ **Type-Safe** API with comprehensive validation
- ✅ **Modular Architecture** for easy extensibility
- ✅ **Expert-Level** prompt engineering for scientific accuracy
- ✅ **Mobile-Responsive** modern UI with Firebase integration
- ✅ **Comprehensive** inventory and procurement management
- ✅ **Automated** alert system with email notifications
- ✅ **Multi-Provider** AI integration with free options
- ✅ **Real-time** data synchronization and updates
- ✅ **Enterprise-Grade** security and user management

---

## 🤝 Contributing

### 🎯 **How to Contribute**

```mermaid
gitgraph
    commit id: "🍴 Fork Repo"
    branch feature
    checkout feature
    commit id: "✨ Add Feature"
    commit id: "🧪 Add Tests"
    commit id: "📝 Update Docs"
    checkout main
    merge feature
    commit id: "🚀 Deploy"
```

### 📋 **Contribution Areas**

<table>
<tr>
<td width="50%">

#### **🔬 Scientific Content**
- 🧪 New laboratory techniques
- 📝 Improved prompt templates
- 🎯 Better troubleshooting logic
- 📚 Domain expertise
- 🔬 Protocol validation
- 📊 Data analysis methods

</td>
<td width="50%">

#### **💻 Technical Improvements**
- 🤖 New LLM providers
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🔒 Security improvements
- 📱 Mobile features

</td>
</tr>
</table>

### 🛠️ **Development Setup**

```bash
# 🍴 Fork and clone
git clone https://github.com/yourusername/ProtoGen.git
cd ProtoGen

# 🔧 Install development dependencies
pip install -r requirements-dev.txt
npm install --include=dev

# 🧪 Run tests
pytest backend/tests/
npm test

# 📝 Format code
black backend/
prettier --write frontend/src/

# 🚀 Start development servers
# Terminal 1: Backend
cd backend && python main.py

# Terminal 2: Frontend  
cd frontend && npm run dev
```

---

## 📞 Support & Community

### 🆘 **Getting Help**

1. **📚 Check Documentation** - Comprehensive guides available
2. **🔍 Search Issues** - Look for existing solutions  
3. **💬 Ask Questions** - Create detailed issue reports
4. **🤝 Join Community** - Connect with other researchers

### 🐛 **Reporting Issues**

```markdown
## 🐛 Bug Report Template

**🎯 Expected Behavior:**
Describe what should happen

**❌ Actual Behavior:**
Describe what actually happens

**🔄 Steps to Reproduce:**
1. Step one
2. Step two  
3. Step three

**🌍 Environment:**
- OS: [Windows/Mac/Linux]
- Python: [Version]
- Node.js: [Version]
- Browser: [Chrome/Firefox/Safari]

**📋 Additional Context:**
Any other relevant information
```

### 📈 **Roadmap & Future Features**

#### **Version 2.0 (Planned)**
- [ ] **Advanced Analytics** - Usage patterns and insights
- [ ] **Mobile Applications** - Native iOS/Android apps
- [ ] **Collaboration Features** - Team workspaces and sharing
- [ ] **Advanced AI** - Image analysis and computer vision
- [ ] **Integration Hub** - Connect with lab equipment
- [ ] **Marketplace** - Protocol templates and tools
- [ ] **Multi-language** - International research support
- [ ] **Offline Mode** - Local LLM support

#### **Long-term Vision**
- [ ] **Lab Automation** - Direct equipment control
- [ ] **Predictive Analytics** - Experiment success prediction
- [ ] **Virtual Lab** - Simulation and modeling
- [ ] **Research Network** - Global collaboration platform
- [ ] **AI Lab Assistant** - Voice-controlled interface

---

## 📄 License & Legal

### 📜 **MIT License**

```
MIT License

Copyright (c) 2024 Proto-Gen Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎉 Changelog & Version History

### **Version 1.0.0** (2024-11-02)
#### **🎉 Initial Release**
- ✅ Core protocol generation and troubleshooting
- ✅ Multiple LLM provider support
- ✅ Modern React frontend with TailwindCSS
- ✅ FastAPI backend with type safety
- ✅ Interactive API documentation

### **Version 1.1.0** (2024-11-03)
#### **🔥 Firebase Integration**
- ✅ User authentication system
- ✅ Data persistence and synchronization
- ✅ Save and bookmark functionality
- ✅ User dashboards and analytics

### **Version 1.2.0** (2024-11-04)
#### **📦 Inventory Management (IMS-Gen)**
- ✅ CSV/Excel inventory upload
- ✅ Llama LLM data processing
- ✅ Low stock alerts and email notifications
- ✅ Real-time inventory tracking

#### **🛒 Procurement Assistant (Procure-Gen)**
- ✅ Multi-vendor price comparison
- ✅ Intelligent purchase recommendations
- ✅ Budget analysis and cost optimization
- ✅ Integration with inventory system

#### **🤖 Enhanced AI Integration**
- ✅ Google Gemini as primary (FREE) provider
- ✅ Llama local LLM support
- ✅ Improved prompt engineering
- ✅ Better error handling and fallbacks

#### **🔗 External Integrations**
- ✅ n8n webhook support
- ✅ Gmail email automation
- ✅ Vendor API integrations
- ✅ Analytics and monitoring

---

<div align="center">

## 🌟 **Built with ❤️ for the Global Scientific Community**

### 🚀 **Accelerating Research Through Intelligent Automation** 🧬

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/AshwithoutCash/ProtoGen)
[![For Science](https://img.shields.io/badge/For-🔬%20Science-blue.svg)](https://github.com/AshwithoutCash/ProtoGen)
[![AI Powered](https://img.shields.io/badge/AI-🤖%20Powered-green.svg)](https://github.com/AshwithoutCash/ProtoGen)
[![Open Source](https://img.shields.io/badge/Open-🌍%20Source-orange.svg)](https://github.com/AshwithoutCash/ProtoGen)

**[⭐ Star this repo](https://github.com/AshwithoutCash/ProtoGen) • [🍴 Fork it](https://github.com/AshwithoutCash/ProtoGen/fork) • [📢 Share it](https://twitter.com/intent/tweet?text=Check%20out%20Proto-Gen%20-%20Complete%20AI%20Laboratory%20Assistant!&url=https://github.com/AshwithoutCash/ProtoGen)**

### 🎯 **From Protocol Generation to Complete Laboratory Management**
*Your AI-powered research companion for the modern laboratory*

</div>
