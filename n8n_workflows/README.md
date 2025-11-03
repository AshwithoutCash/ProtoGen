# n8n Workflows for Proto-Gen

This directory contains n8n workflow definitions for orchestrating Proto-Gen's local AI stack operations.

## Required Workflows

### 1. Route Generation Workflow
**Purpose**: Orchestrate multi-step experimental route planning with web research.

**Webhook URL**: `/webhook/route-generation`

**Workflow Steps**:
1. **Webhook Trigger**: Receives route generation request
2. **Data Preparation**: Format inputs for Langflow
3. **Langflow Call**: Execute protocol generation for each route option
4. **Web Search**: Research alternative approaches and methodologies
5. **Comparison Analysis**: Use Ollama to compare route options
6. **Output Formatting**: Structure final route recommendations
7. **Response**: Return formatted routes to Proto-Gen

**Input Schema**:
```json
{
  "overarching_goal": "string",
  "starting_material": "string", 
  "target_organism": "string",
  "constraints": "string"
}
```

**Output Schema**:
```json
{
  "routes": "markdown formatted route comparison",
  "success": true,
  "metadata": {
    "routes_generated": 3,
    "research_sources": ["url1", "url2"],
    "processing_time": "45s"
  }
}
```

### 2. Tool Generation Workflow
**Purpose**: Recommend computational tools with web search for tutorials.

**Webhook URL**: `/webhook/tool-generation`

**Workflow Steps**:
1. **Webhook Trigger**: Receives tool recommendation request
2. **LLM Analysis**: Use Ollama to analyze computational requirements
3. **Tool Database Search**: Query local/web databases for relevant tools
4. **Scoring Algorithm**: Apply 2:1 relevance:price weighting
5. **Tutorial Search**: Find YouTube tutorials for recommended tools
6. **Guide Generation**: Create step-by-step usage guides
7. **Response Formatting**: Structure tool recommendations
8. **Response**: Return formatted tool guide to Proto-Gen

**Input Schema**:
```json
{
  "computational_goal": "string",
  "technique_type": "string",
  "data_type": "string", 
  "context": "string"
}
```

**Output Schema**:
```json
{
  "tools": "markdown formatted tool recommendations",
  "success": true,
  "metadata": {
    "tools_evaluated": 15,
    "top_recommendation": "tool_name",
    "tutorial_links": ["youtube_url1", "youtube_url2"]
  }
}
```

## Setup Instructions

### 1. Start n8n
```bash
# Via Docker (recommended)
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n

# Or via npm
npm install n8n -g
n8n start
```

### 2. Access n8n UI
- Open: http://localhost:5678
- Create account/login
- Set up initial workspace

### 3. Install Required Nodes
Install these community nodes in n8n:
- **@n8n/n8n-nodes-langchain**: For LLM operations
- **n8n-nodes-ollama**: Direct Ollama integration
- **n8n-nodes-web-scraper**: For web research
- **n8n-nodes-youtube**: For tutorial search

### 4. Import Workflows
1. Copy workflow JSON files to n8n
2. Import via n8n UI: Settings → Import from file
3. Configure webhook URLs
4. Test each workflow

### 5. Configure Connections
- **Ollama Connection**: http://localhost:11434
- **Langflow Connection**: http://localhost:7860
- **Web Search API**: Configure search provider (DuckDuckGo, etc.)
- **YouTube API**: Set up API key for tutorial search

## Workflow Templates

### Route Generation Nodes
```
[Webhook] → [Set Variables] → [Langflow HTTP Request] → [Web Search] → [Ollama Analysis] → [Format Output] → [Respond to Webhook]
```

### Tool Generation Nodes  
```
[Webhook] → [Parse Input] → [Ollama Tool Analysis] → [Web Tool Search] → [Score Tools] → [YouTube Search] → [Generate Guide] → [Respond to Webhook]
```

## Configuration Examples

### Ollama Node Configuration
```json
{
  "baseURL": "http://localhost:11434",
  "model": "llama3:8b",
  "temperature": 0.7,
  "maxTokens": 2000
}
```

### Langflow HTTP Request
```json
{
  "method": "POST",
  "url": "http://localhost:7860/api/v1/run/{{$node.Webhook.json.flow_id}}",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "inputs": "={{$node.Set.json}}"
  }
}
```

### Web Search Configuration
```json
{
  "query": "{{$node.Set.json.search_terms}}",
  "maxResults": 10,
  "searchEngine": "duckduckgo",
  "filterDomains": ["protocols.io", "nature.com", "pubmed.ncbi.nlm.nih.gov"]
}
```

## Testing Workflows

### Test Route Generation
```bash
curl -X POST http://localhost:5678/webhook/route-generation \
  -H "Content-Type: application/json" \
  -d '{
    "overarching_goal": "Express and purify His-tagged protein",
    "starting_material": "Plasmid DNA", 
    "target_organism": "E. coli BL21(DE3)",
    "constraints": "Complete in 1 week"
  }'
```

### Test Tool Generation
```bash
curl -X POST http://localhost:5678/webhook/tool-generation \
  -H "Content-Type: application/json" \
  -d '{
    "computational_goal": "Design PCR primers",
    "technique_type": "Primer Design",
    "data_type": "DNA sequence (FASTA)",
    "context": "Need free tools only"
  }'
```

## Monitoring and Debugging

1. **Execution Logs**: Monitor workflow executions in n8n UI
2. **Error Handling**: Configure error workflows for failed executions
3. **Performance**: Monitor execution times and resource usage
4. **Webhooks**: Test webhook endpoints independently
5. **Integration**: Verify data flow between n8n, Langflow, and Ollama

## Security Considerations

- **Local Network**: Ensure all services run on localhost
- **API Keys**: Store YouTube API keys securely in n8n credentials
- **Data Privacy**: All processing happens locally (no external API calls)
- **Access Control**: Configure n8n authentication for production use

## Troubleshooting

### Common Issues
1. **Connection Refused**: Verify Ollama/Langflow services are running
2. **Timeout Errors**: Increase timeout values for LLM operations
3. **Memory Issues**: Monitor Ollama memory usage during workflows
4. **Webhook Failures**: Check n8n webhook URL configuration
5. **JSON Parsing**: Validate input/output schemas match expectations
