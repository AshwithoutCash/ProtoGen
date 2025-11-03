#!/usr/bin/env python3
"""
Test Protein Modeling Tools - Same as user's request
"""

import requests
import json

def test_protein_modeling():
    """Test protein modeling request like the user's"""
    
    print("🧬 Testing Protein Modeling Tools")
    print("=" * 50)
    
    # Same request as user mentioned
    tool_request = {
        "user_goal": "Protein sequence analysis",
        "technique": "Protein modelling", 
        "data_type": ".PDB",
        "additional_context": "Need accurate structural analysis tools"
    }
    
    print("Request:")
    print(json.dumps(tool_request, indent=2))
    print("\nSending to backend...")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/tools",
            json=tool_request,
            timeout=600
        )
        
        result = response.json()
        
        print(f"\nResponse:")
        print(f"Status Code: {response.status_code}")
        print(f"Success: {result.get('success', False)}")
        print(f"Provider: {result.get('provider_used', 'unknown')}")
        
        if result.get('success'):
            tools = result.get('tools', '')
            print(f"Tools length: {len(tools)} characters")
            
            # Check for generic names
            has_generic_names = ("Tool Option 1" in tools or "Tool Option 2" in tools)
            
            print(f"\n📊 Quality Check:")
            print(f"  ❌ Has generic names: {has_generic_names}")
            print(f"  ✅ Has specific tools: {not has_generic_names}")
            
            # Look for actual tool names
            tool_names_found = []
            if "Tool #1:" in tools:
                start = tools.find("Tool #1:") + 8
                end = tools.find("\n", start)
                if end > start:
                    tool1_name = tools[start:end].strip()
                    tool_names_found.append(tool1_name)
            
            if "Tool #2:" in tools:
                start = tools.find("Tool #2:") + 8
                end = tools.find("\n", start)
                if end > start:
                    tool2_name = tools[start:end].strip()
                    tool_names_found.append(tool2_name)
            
            print(f"  🔧 Tool names found: {tool_names_found}")
            
            print(f"\n📝 Full Response:")
            print("-" * 60)
            print(tools)
            print("-" * 60)
            
            return not has_generic_names
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"Request failed: {e}")
        return False

if __name__ == "__main__":
    success = test_protein_modeling()
    if success:
        print("\n✅ Got specific tool names!")
    else:
        print("\n❌ Still getting generic names")
