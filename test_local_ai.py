#!/usr/bin/env python3
"""
Test script for Proto-Gen Local AI Stack
Tests Ollama-only processing with optional Gemini search
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from local_ai_integration import LocalAIService, LocalAIConfig
import json

def test_protocol_generation():
    """Test protocol generation using Ollama."""
    print("🧪 Testing Protocol Generation (Ollama + Optional Gemini Search)")
    print("=" * 60)
    
    # Initialize local AI service
    service = LocalAIService()
    
    # Test protocol generation request
    request_data = {
        "experimental_goal": "Amplify a specific gene for cloning",
        "technique": "PCR",
        "reagents": "Q5 High-Fidelity DNA Polymerase, dNTPs, primers",
        "template": "Genomic DNA",
        "num_reactions": "1",
        "other_params": "High GC content target"
    }
    
    print("Request:")
    print(json.dumps(request_data, indent=2))
    print("\nGenerating protocol...")
    
    # Generate protocol
    result = service.generate_protocol_local(request_data)
    
    print(f"\nResult:")
    print(f"Success: {result['success']}")
    print(f"Provider: {result['provider_used']}")
    print(f"Model: {result.get('model_used', 'N/A')}")
    
    if result['success']:
        print(f"\nProtocol (first 500 chars):")
        print(result['protocol'][:500] + "..." if len(result['protocol']) > 500 else result['protocol'])
    else:
        print(f"Error: {result.get('error', 'Unknown error')}")
    
    return result['success']

def test_troubleshooting():
    """Test troubleshooting using Ollama."""
    print("\n🔧 Testing Troubleshooting (Ollama + Optional Gemini Search)")
    print("=" * 60)
    
    service = LocalAIService()
    
    request_data = {
        "protocol_text": "PCR amplification using Q5 polymerase at 98°C denaturation, 60°C annealing, 72°C extension",
        "issue_description": "No PCR product visible on gel",
        "expected_outcome": "Single band at 1.2 kb",
        "actual_outcome": "No bands visible, only primer dimers"
    }
    
    print("Request:")
    print(json.dumps(request_data, indent=2))
    print("\nAnalyzing issue...")
    
    result = service.troubleshoot_protocol_local(request_data)
    
    print(f"\nResult:")
    print(f"Success: {result['success']}")
    print(f"Provider: {result['provider_used']}")
    print(f"Model: {result.get('model_used', 'N/A')}")
    
    if result['success']:
        print(f"\nAnalysis (first 500 chars):")
        print(result['analysis'][:500] + "..." if len(result['analysis']) > 500 else result['analysis'])
    else:
        print(f"Error: {result.get('error', 'Unknown error')}")
    
    return result['success']

def test_health_check():
    """Test health check of local AI components."""
    print("\n🏥 Testing Health Check")
    print("=" * 60)
    
    service = LocalAIService()
    health = service.health_check()
    
    print("Health Status:")
    for component, status in health.items():
        print(f"  {component}: {'✅' if status else '❌'}")
    
    return health.get('overall', False)

def main():
    """Run all tests."""
    print("🚀 Proto-Gen Local AI Stack Test Suite")
    print("Architecture: Ollama (all AI) + Gemini (search only)")
    print("=" * 60)
    
    # Check if Gemini API key is available
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    print(f"Gemini API Key: {'✅ Available' if gemini_key else '❌ Not set (search disabled)'}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Protocol Generation", test_protocol_generation),
        ("Troubleshooting", test_troubleshooting)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"\n❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! Local AI stack is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    return passed == len(results)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
