#!/usr/bin/env python3
"""
Test Comprehensive Tool Generation
"""

import requests
import json

def test_comprehensive_tools():
    """Test the new comprehensive tool generation format"""
    
    print("🔧 Testing Comprehensive Tool Generation (2 Tools with Full Guides)")
    print("=" * 70)
    
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
            timeout=300
        )
        
        result = response.json()
        
        print(f"\nResponse:")
        print(f"Status Code: {response.status_code}")
        print(f"Success: {result.get('success', False)}")
        print(f"Provider: {result.get('provider_used', 'unknown')}")
        
        if result.get('success'):
            tools = result.get('tools', '')
            print(f"Tools length: {len(tools)} characters")
            print(f"\n{'='*70}")
            print("FULL TOOL RECOMMENDATIONS:")
            print(f"{'='*70}")
            print(tools)
            print(f"{'='*70}")
            
            # Check if it contains expected sections
            sections = ['Overview', 'Guide', 'Pricing', 'Usage', 'Alternative']
            found_sections = []
            for section in sections:
                if section.lower() in tools.lower():
                    found_sections.append(section)
            
            print(f"\nSections found: {found_sections}")
            print(f"Tool #1 mentioned: {'Tool #1' in tools or '## 1' in tools}")
            print(f"Tool #2 mentioned: {'Tool #2' in tools or '## 2' in tools}")
            
            return True
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"Request failed: {e}")
        return False

if __name__ == "__main__":
    success = test_comprehensive_tools()
    if success:
        print("\n✅ Comprehensive tool generation working!")
    else:
        print("\n❌ Tool generation failed")
