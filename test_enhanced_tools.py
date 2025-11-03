#!/usr/bin/env python3
"""
Test Enhanced Tool Generation: Gemini Research + Llama Refinement
"""

import requests
import json
import os

def test_enhanced_tools():
    """Test the new two-stage tool generation"""
    
    print("🔬 Testing Enhanced Tool Generation")
    print("Architecture: Gemini Research → Llama Refinement")
    print("=" * 60)
    
    # Check if Gemini API key is available
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    if gemini_key:
        print("✅ Gemini API Key available - will use enhanced mode")
    else:
        print("⚠️  No Gemini API Key - will use Llama-only mode")
    
    # Test tool generation request
    tool_request = {
        "user_goal": "Analyze protein sequences for phylogenetic relationships",
        "technique": "Multiple Sequence Alignment", 
        "data_type": "Protein FASTA sequences",
        "additional_context": "Need free tools, must handle 100+ sequences"
    }
    
    print(f"\nRequest:")
    print(json.dumps(tool_request, indent=2))
    print(f"\nSending to enhanced backend...")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/tools",
            json=tool_request,
            timeout=600  # Allow time for research + refinement
        )
        
        result = response.json()
        
        print(f"\nResponse:")
        print(f"Status Code: {response.status_code}")
        print(f"Success: {result.get('success', False)}")
        print(f"Provider: {result.get('provider_used', 'unknown')}")
        
        if result.get('success'):
            tools = result.get('tools', '')
            print(f"Tools length: {len(tools)} characters")
            
            # Check format compliance
            format_checks = {
                "Has Tool #1": "# Tool #1:" in tools,
                "Has Tool #2": "# Tool #2:" in tools,
                "Has Overview sections": tools.count("## Overview") >= 2,
                "Has Installation sections": tools.count("## Installation") >= 1 or tools.count("## Complete Installation") >= 1,
                "Has Pricing sections": tools.count("## Pricing") >= 2,
                "Has Usage sections": tools.count("## Usage") >= 1 or tools.count("## Detailed Usage") >= 1,
                "Has Alternatives sections": tools.count("## Alternative") >= 2,
                "Exactly 2 tools": tools.count("# Tool #") == 2
            }
            
            print(f"\n📊 Format Analysis:")
            for check, passed in format_checks.items():
                status = "✅" if passed else "❌"
                print(f"  {status} {check}")
            
            print(f"\n📝 Response Preview (first 800 chars):")
            print("-" * 60)
            print(tools[:800] + "..." if len(tools) > 800 else tools)
            print("-" * 60)
            
            # Overall assessment
            passed_checks = sum(format_checks.values())
            total_checks = len(format_checks)
            
            if passed_checks >= total_checks - 1:  # Allow 1 minor failure
                print(f"\n🎉 Enhanced ToolGen working! ({passed_checks}/{total_checks} checks passed)")
                return True
            else:
                print(f"\n⚠️  Format needs improvement ({passed_checks}/{total_checks} checks passed)")
                return False
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"Request failed: {e}")
        return False

if __name__ == "__main__":
    success = test_enhanced_tools()
    if success:
        print("\n✅ Enhanced tool generation successful!")
    else:
        print("\n❌ Enhancement needs work")
