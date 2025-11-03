# Langflow Flows for Proto-Gen

This directory contains the Langflow flow definitions required for Proto-Gen's local AI stack.

## Required Flows

### 1. Protocol Generation Flow (`protocol-gen-flow.json`)
**Purpose**: Generate detailed laboratory protocols based on user inputs.

**Inputs**:
- `experimental_goal`: The objective of the experiment
- `technique`: Laboratory technique to be used
- `reagents`: Required reagents and materials
- `template`: Template or starting material
- `num_reactions`: Number of reactions to perform
- `other_params`: Additional parameters or constraints

**Components**:
- **Input Node**: Receives user parameters
- **Prompt Template**: Uses system prompt from Part 2 of the blueprint
- **LLM Node**: Connected to local Ollama (llama3:8b)
- **Output Parser**: Formats the protocol in markdown
- **Output Node**: Returns structured protocol

**Flow ID**: `protocol-gen-flow-id` (update in local_ai_integration.py)

### 2. Troubleshooting Flow (`troubleshoot-flow.json`)
**Purpose**: Analyze protocol issues and provide solutions.

**Inputs**:
- `protocol_text`: The original protocol
- `issue_description`: Description of the problem
- `expected_outcome`: What should have happened
- `actual_outcome`: What actually happened

**Components**:
- **Input Node**: Receives troubleshooting parameters
- **Prompt Template**: Uses troubleshooting system prompt from Part 3
- **LLM Node**: Connected to local Ollama
- **Analysis Parser**: Structures the troubleshooting analysis
- **Output Node**: Returns diagnostic analysis and solutions

**Flow ID**: `troubleshoot-flow-id` (update in local_ai_integration.py)

## Setup Instructions

1. **Start Langflow**:
   ```bash
   python -m langflow run
   ```

2. **Access Langflow UI**: http://localhost:7860

3. **Import Flows**:
   - Click "Import" in Langflow UI
   - Upload the JSON files from this directory
   - Configure LLM nodes to point to Ollama (http://localhost:11434)

4. **Configure LLM Connections**:
   - In each flow, select the LLM node
   - Set Base URL: `http://localhost:11434`
   - Set Model: `llama3:8b` (or your preferred local model)
   - Test the connection

5. **Get Flow IDs**:
   - After importing, note the Flow IDs from the URL or flow settings
   - Update the IDs in `local_ai_integration.py`:
     - Replace `protocol-gen-flow-id` with actual ID
     - Replace `troubleshoot-flow-id` with actual ID

6. **Test Flows**:
   - Use the "Run" button in Langflow to test each flow
   - Verify outputs are properly formatted
   - Ensure Ollama connection is working

## Flow Templates

### Protocol Generation System Prompt
```
You are an expert molecular biologist and laboratory protocol specialist. Generate detailed, step-by-step laboratory protocols that are:

1. **Scientifically Accurate**: Based on established methods and best practices
2. **Detailed and Precise**: Include exact volumes, concentrations, temperatures, and timing
3. **Safety-Conscious**: Include relevant safety warnings and precautions
4. **Reproducible**: Clear enough for another researcher to follow exactly

Format your response as a structured markdown document with:
- Clear section headers
- Numbered steps
- Material lists with quantities
- Time estimates
- Quality control checkpoints
- Troubleshooting notes

Focus on the {technique} technique for {experimental_goal}.
```

### Troubleshooting System Prompt
```
You are an expert laboratory troubleshooter with extensive experience in molecular biology protocols. Analyze the provided protocol issue and provide:

1. **Root Cause Analysis**: Identify the most likely causes of the problem
2. **Systematic Diagnosis**: Step-by-step approach to confirm the cause
3. **Specific Solutions**: Detailed corrective actions with rationale
4. **Prevention Strategies**: How to avoid this issue in future experiments

Consider:
- Protocol deviations
- Equipment issues
- Reagent quality/storage
- Environmental factors
- Technique variations
- Contamination sources

Provide your analysis in structured markdown format with clear sections and actionable recommendations.
```

## Notes

- Flows must be created manually in Langflow UI initially
- JSON export/import will be available once flows are built
- Ensure all LLM nodes point to the same local Ollama instance
- Test flows thoroughly before integrating with Proto-Gen backend
- Monitor Ollama resource usage during flow execution
