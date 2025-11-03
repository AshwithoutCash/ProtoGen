#!/usr/bin/env python3
"""
Test Tool Generation with Local AI
"""

import requests
import json

def test_tool_generation():
    """Test tool generation endpoint"""
    
    print("🔧 Testing Tool Generation with Local AI")
    print("=" * 50)
    
    # Test tool generation request
    tool_request = {
        "user_goal": "Design PCR primers for gene amplification",
        "technique": "Primer Design", 
        "data_type": "DNA sequence (FASTA format)",
        "additional_context": "Need free tools only, high GC content target"
    }
    
    print("Request:")
    print(json.dumps(tool_request, indent=2))
    print("\nSending to backend...")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/tools",
            json=tool_request,
            timeout=600  # Increased timeout for comprehensive responses
        )
        
        result = response.json()
        
        print(f"\nResponse:")
        print(f"Status Code: {response.status_code}")
        print(f"Success: {result.get('success', False)}")
        print(f"Provider: {result.get('provider_used', 'unknown')}")
        
        if result.get('success'):
            tools = result.get('tools', '')
            print(f"Tools length: {len(tools)} characters")
            print(f"Tools preview: {tools[:300]}...")
            return True
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"Request failed: {e}")
        return False

if __name__ == "__main__":
    success = test_tool_generation()
    if success:
        print("\n✅ Tool generation working with local AI!")
    else:
        print("\n❌ Tool generation failed")
