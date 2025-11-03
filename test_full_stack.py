#!/usr/bin/env python3
"""
Full Stack Test - Frontend + Backend + Local AI
Tests the complete Proto-Gen system with local Ollama
"""

import requests
import json
import time

def test_full_stack():
    """Test the complete stack: Frontend API calls -> Backend -> Ollama"""
    
    print("🧪 Testing Full Proto-Gen Stack with Local AI")
    print("=" * 60)
    
    # Test 1: Health Check
    print("1. Testing Health Check...")
    try:
        response = requests.get("http://localhost:8000/api/v1/health", timeout=10)
        health = response.json()
        print(f"   Status: {health['status']}")
        print(f"   Providers: {health['available_providers']}")
        
        if "local_ai_stack" in health['available_providers']:
            print("   ✅ Local AI stack detected!")
        else:
            print("   ❌ Local AI stack not detected")
            return False
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        return False
    
    # Test 2: Protocol Generation (same as frontend would call)
    print("\n2. Testing Protocol Generation...")
    protocol_request = {
        "experimental_goal": "Amplify target gene for cloning",
        "technique": "PCR", 
        "reagents": "Q5 polymerase, dNTPs, primers",
        "template_details": "Human genomic DNA, 50 ng/µL",
        "primer_details": "Forward: ATGCGATCG, Reverse: CGATCGATC",
        "amplicon_size": "800 bp",
        "reaction_volume": "25",
        "num_reactions": "1",
        "other_params": "Standard PCR conditions",
        "llm_provider": "gemini"  # This will be overridden by local AI
    }
    
    try:
        print("   Sending request to backend...")
        start_time = time.time()
        
        response = requests.post(
            "http://localhost:8000/api/v1/generate",
            json=protocol_request,
            timeout=300  # Allow time for Ollama processing
        )
        
        end_time = time.time()
        result = response.json()
        
        print(f"   Response time: {end_time - start_time:.1f} seconds")
        print(f"   Success: {result.get('success', False)}")
        print(f"   Provider used: {result.get('provider_used', 'unknown')}")
        
        if result.get('success'):
            protocol = result.get('protocol', '')
            print(f"   Protocol length: {len(protocol)} characters")
            print(f"   Protocol preview: {protocol[:200]}...")
            
            # Check if it looks like a real protocol
            if any(keyword in protocol.lower() for keyword in ['pcr', 'protocol', 'step', 'temperature', 'µl']):
                print("   ✅ Protocol generation successful!")
                return True
            else:
                print("   ❌ Protocol doesn't look valid")
                return False
        else:
            print(f"   ❌ Protocol generation failed: {result.get('error', 'Unknown error')}")
            return False
            
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out (Ollama may be processing)")
        return False
    except Exception as e:
        print(f"   ❌ Protocol generation failed: {e}")
        return False

def test_techniques_endpoint():
    """Test the techniques endpoint that frontend uses"""
    print("\n3. Testing Techniques Endpoint...")
    try:
        response = requests.get("http://localhost:8000/api/v1/techniques", timeout=10)
        techniques = response.json()
        print(f"   Available techniques: {len(techniques.get('techniques', []))}")
        print("   ✅ Techniques endpoint working!")
        return True
    except Exception as e:
        print(f"   ❌ Techniques endpoint failed: {e}")
        return False

def main():
    """Run full stack tests"""
    print("🚀 Proto-Gen Full Stack Test")
    print("Architecture: Frontend -> Backend -> Ollama (Local AI)")
    print("=" * 60)
    
    # Check if services are running
    services = {
        "Backend (FastAPI)": "http://localhost:8000/api/v1/health",
        "Frontend (Vite)": "http://localhost:5174",
        "Ollama": "http://localhost:11434/api/tags",
        "n8n": "http://localhost:5678/rest/login"
    }
    
    print("Checking services...")
    for service, url in services.items():
        try:
            response = requests.get(url, timeout=5)
            status = "✅ Running" if response.status_code in [200, 401] else f"❌ Status {response.status_code}"
        except:
            status = "❌ Not responding"
        print(f"  {service}: {status}")
    
    print("\n" + "=" * 60)
    
    # Run tests
    tests = [
        test_full_stack,
        test_techniques_endpoint
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n{'=' * 60}")
    print(f"🏁 RESULTS: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 Full stack is working with local AI!")
        print("\n📱 You can now use the web interface at:")
        print("   http://localhost:5174")
        print("\n🔧 All processing is done locally by Ollama")
        print("   No external API calls for protocol generation!")
    else:
        print("⚠️  Some tests failed. Check the services above.")
    
    return passed == len(tests)

if __name__ == "__main__":
    main()
