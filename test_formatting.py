#!/usr/bin/env python3
"""
Test the formatting function directly
"""

import sys
sys.path.append('.')

from local_ai_integration import LocalAIService

def test_formatting():
    """Test the formatting function"""
    
    service = LocalAIService()
    
    # Sample raw response (like what Ollama returns)
    raw_response = """Here are some computational tool recommendations:

1. **Primer3**
2. **OligoAnalyzer** 
3. **NCBI Primer-BLAST**
4. **VectorNTI**

Usage instructions and details..."""
    
    request_data = {
        "computational_goal": "Design PCR primers for gene amplification",
        "technique_type": "Primer Design",
        "data_type": "DNA sequence (FASTA format)",
        "context": "Need free tools only"
    }
    
    print("🔧 Testing Formatting Function")
    print("=" * 50)
    print("Raw response:")
    print(raw_response)
    print("\n" + "=" * 50)
    print("Formatted response:")
    
    formatted = service._format_tool_recommendations(raw_response, request_data)
    print(formatted)
    
    print("\n" + "=" * 50)
    print("Analysis:")
    print(f"- Contains 'Tool #1': {'Tool #1' in formatted}")
    print(f"- Contains 'Tool #2': {'Tool #2' in formatted}")
    print(f"- Contains 'Overview': {'Overview' in formatted}")
    print(f"- Contains 'Pricing': {'Pricing' in formatted}")
    print(f"- Length: {len(formatted)} characters")

if __name__ == "__main__":
    test_formatting()
