# Proto-Gen API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Currently, no authentication is required. API keys for LLM providers are configured on the server side.

## Endpoints

### 1. Health Check

Check the health status of the API and available LLM providers.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "available_providers": ["openai", "anthropic"]
}
```

**Status Codes:**
- `200 OK`: Service is healthy

---

### 2. Generate Protocol

Generate a detailed laboratory protocol based on experimental parameters.

**Endpoint:** `POST /generate`

**Request Body:**

```json
{
  "experimental_goal": "Amplify a 700bp gene fragment for cloning",
  "technique": "PCR",
  "reagents": "Q5 High-Fidelity DNA Polymerase",
  "template_details": "Human genomic DNA, 50 ng/µL",
  "primer_details": "Forward: ATGC..., Reverse: GCTA..., Tm: 58-60°C",
  "amplicon_size": "700 bp",
  "reaction_volume": "25",
  "num_reactions": "8",
  "other_params": "GC-rich template, need high fidelity",
  "llm_provider": "openai"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `experimental_goal` | string | Yes | The experimental goal (min 10 chars) |
| `technique` | string | Yes | Laboratory technique (see Techniques section) |
| `reagents` | string | Yes | Key reagents/enzymes (min 3 chars) |
| `template_details` | string | Yes | Template details (min 5 chars) |
| `primer_details` | string | No | Primer/DNA fragment details |
| `amplicon_size` | string | No | Desired amplicon size |
| `reaction_volume` | string | No | Reaction volume in µL (default: "25") |
| `num_reactions` | string | No | Number of reactions (default: "1") |
| `other_params` | string | No | Other parameters or requirements |
| `llm_provider` | string | No | LLM provider: "openai" or "anthropic" (default: "openai") |

**Response:**

```json
{
  "success": true,
  "protocol": "### Protocol: PCR Amplification of 700bp Gene Fragment\n\n**1. Materials and Reagents**\n...",
  "provider_used": "openai",
  "error": null
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request was successful |
| `protocol` | string | Generated protocol in Markdown format |
| `provider_used` | string | LLM provider that was used |
| `error` | string/null | Error message if request failed |

**Status Codes:**
- `200 OK`: Protocol generated successfully
- `422 Unprocessable Entity`: Invalid request parameters
- `500 Internal Server Error`: Server error or LLM API error

**Example cURL:**

```bash
curl -X POST http://localhost:8000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "experimental_goal": "Amplify GAPDH gene",
    "technique": "PCR",
    "reagents": "Q5 Polymerase",
    "template_details": "Human gDNA, 50 ng/µL",
    "reaction_volume": "25",
    "num_reactions": "1"
  }'
```

---

### 3. Troubleshoot Protocol

Analyze a failed experiment and get troubleshooting suggestions.

**Endpoint:** `POST /troubleshoot`

**Request Body:**

```json
{
  "observed_problem": "No PCR band visible on gel, only primer dimers",
  "original_protocol": "PCR Reaction (25 µL):\n- 12.5 µL Taq Master Mix\n- 1 µL Forward Primer\n...",
  "additional_details": "Template DNA A260/A280 = 1.85, fresh reagents",
  "technique": "PCR",
  "llm_provider": "openai"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `observed_problem` | string | Yes | Description of the problem (min 10 chars) |
| `original_protocol` | string | Yes | The protocol that was used (min 20 chars) |
| `additional_details` | string | No | Additional experimental details |
| `technique` | string | No | Technique used (see Techniques section) |
| `llm_provider` | string | No | LLM provider: "openai" or "anthropic" (default: "openai") |

**Response:**

```json
{
  "success": true,
  "protocol": "### Troubleshooting Analysis\n\n**1. Potential Cause: Annealing Temperature Too High**\n...",
  "provider_used": "openai",
  "error": null
}
```

**Response Fields:** Same as Generate Protocol endpoint

**Status Codes:**
- `200 OK`: Analysis generated successfully
- `422 Unprocessable Entity`: Invalid request parameters
- `500 Internal Server Error`: Server error or LLM API error

**Example cURL:**

```bash
curl -X POST http://localhost:8000/api/v1/troubleshoot \
  -H "Content-Type: application/json" \
  -d '{
    "observed_problem": "No product on gel",
    "original_protocol": "Standard PCR with Taq at 60°C annealing",
    "technique": "PCR"
  }'
```

---

### 4. Get Techniques

Get a list of all supported laboratory techniques.

**Endpoint:** `GET /techniques`

**Response:**

```json
{
  "techniques": [
    {"value": "PCR", "label": "PCR"},
    {"value": "qPCR", "label": "qPCR"},
    {"value": "Gibson Assembly", "label": "Gibson Assembly"},
    {"value": "Miniprep", "label": "Miniprep"},
    {"value": "Gel Electrophoresis", "label": "Gel Electrophoresis"},
    {"value": "Restriction Digestion", "label": "Restriction Digestion"},
    {"value": "Ligation", "label": "Ligation"},
    {"value": "Transformation", "label": "Transformation"},
    {"value": "Western Blot", "label": "Western Blot"},
    {"value": "ELISA", "label": "ELISA"},
    {"value": "Other", "label": "Other"}
  ]
}
```

**Status Codes:**
- `200 OK`: Techniques retrieved successfully

---

### 5. Get Providers

Get a list of available LLM providers.

**Endpoint:** `GET /providers`

**Response:**

```json
{
  "providers": ["openai", "anthropic"]
}
```

**Note:** Only providers with valid API keys configured will be listed.

**Status Codes:**
- `200 OK`: Providers retrieved successfully

---

## Supported Techniques

The following techniques are currently supported:

- **PCR**: Polymerase Chain Reaction
- **qPCR**: Quantitative PCR (Real-time PCR)
- **Gibson Assembly**: DNA assembly method
- **Miniprep**: Plasmid DNA extraction
- **Gel Electrophoresis**: DNA/protein separation
- **Restriction Digestion**: DNA cutting with restriction enzymes
- **Ligation**: DNA joining
- **Transformation**: Introducing DNA into cells
- **Western Blot**: Protein detection
- **ELISA**: Enzyme-Linked Immunosorbent Assay
- **Other**: Other techniques

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "protocol": "",
  "provider_used": "",
  "error": "Error message describing what went wrong"
}
```

### Common Errors

**1. No LLM Providers Available**

```json
{
  "detail": "No LLM providers are available. Please configure API keys in .env file."
}
```

**Solution:** Configure at least one LLM provider API key in the backend `.env` file.

---

**2. Invalid Request Parameters**

```json
{
  "detail": [
    {
      "loc": ["body", "experimental_goal"],
      "msg": "ensure this value has at least 10 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

**Solution:** Check that all required fields are provided and meet minimum length requirements.

---

**3. LLM API Error**

```json
{
  "success": false,
  "error": "OpenAI API error: Rate limit exceeded"
}
```

**Solution:** Check your API key usage limits and quotas.

---

## Rate Limiting

Currently, no rate limiting is implemented on the API level. However, you are subject to the rate limits of the underlying LLM providers:

- **OpenAI**: Varies by plan (typically 3-60 requests per minute)
- **Anthropic**: Varies by plan

---

## Best Practices

### 1. Request Optimization

- **Be Specific**: Provide detailed information for better results
- **Use Appropriate Technique**: Select the correct technique from the list
- **Include Context**: Add relevant details in `other_params` or `additional_details`

### 2. Error Handling

- Always check the `success` field in responses
- Implement retry logic for transient errors
- Handle rate limiting gracefully

### 3. Provider Selection

- OpenAI (GPT-4) is recommended for most use cases
- Anthropic (Claude) can be used as an alternative
- The system will automatically fall back if the preferred provider is unavailable

### 4. Response Processing

- Protocols are returned in Markdown format
- Use a Markdown parser to render formatted output
- Preserve formatting for tables and code blocks

---

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function generateProtocol() {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/generate', {
      experimental_goal: 'Amplify GAPDH gene',
      technique: 'PCR',
      reagents: 'Q5 Polymerase',
      template_details: 'Human gDNA, 50 ng/µL',
      reaction_volume: '25',
      num_reactions: '1'
    });
    
    if (response.data.success) {
      console.log(response.data.protocol);
    } else {
      console.error('Error:', response.data.error);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}
```

### Python

```python
import requests

def generate_protocol():
    url = 'http://localhost:8000/api/v1/generate'
    data = {
        'experimental_goal': 'Amplify GAPDH gene',
        'technique': 'PCR',
        'reagents': 'Q5 Polymerase',
        'template_details': 'Human gDNA, 50 ng/µL',
        'reaction_volume': '25',
        'num_reactions': '1'
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    
    if result['success']:
        print(result['protocol'])
    else:
        print(f"Error: {result['error']}")
```

### React/Frontend

```javascript
import axios from 'axios';

const generateProtocol = async (formData) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/api/v1/generate',
      formData
    );
    
    if (response.data.success) {
      return response.data.protocol;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error('Failed to generate protocol:', error);
    throw error;
  }
};
```

---

## Interactive Documentation

For interactive API documentation with a built-in testing interface, visit:

```
http://localhost:8000/docs
```

This provides:
- Interactive API explorer
- Request/response examples
- Schema documentation
- Try-it-out functionality

---

## Versioning

Current API version: **v1**

The API version is included in the URL path (`/api/v1/`). Future versions will be released as `/api/v2/`, etc., maintaining backward compatibility.

---

## Support

For issues or questions:
1. Check the error message in the response
2. Verify your API keys are configured correctly
3. Ensure all required parameters are provided
4. Check the interactive documentation at `/docs`
5. Review the examples in `EXAMPLES.md`
