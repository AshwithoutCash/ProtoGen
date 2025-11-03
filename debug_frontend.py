#!/usr/bin/env python3
"""
Debug Frontend Issues
Check for common frontend problems
"""

import requests
import json

def debug_frontend():
    """Debug frontend loading issues"""
    
    print("🔍 Debugging Frontend Issues")
    print("=" * 50)
    
    # Test basic connectivity
    try:
        response = requests.get("http://localhost:5174", timeout=5)
        print(f"✅ Frontend Status: {response.status_code}")
        print(f"✅ Content Length: {len(response.text)} bytes")
        
        if response.status_code == 200:
            if len(response.text) < 1000:
                print("⚠️  Warning: Response seems too small")
                print("First 500 chars:")
                print(response.text[:500])
            else:
                print("✅ Response size looks normal")
                
        # Check for common issues in HTML
        html = response.text.lower()
        if 'error' in html:
            print("❌ Error found in HTML response")
        if 'blank' in html or 'white' in html:
            print("⚠️  Possible blank page indicators found")
        if 'react' in html:
            print("✅ React app detected")
        if 'vite' in html:
            print("✅ Vite dev server detected")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to frontend")
        print("💡 Make sure 'npm run dev' is running")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Test specific routes
    test_routes = [
        "/test",
        "/signin", 
        "/signup"
    ]
    
    print("\n🔗 Testing Routes:")
    for route in test_routes:
        try:
            response = requests.get(f"http://localhost:5174{route}", timeout=5)
            print(f"  {route}: {response.status_code}")
        except:
            print(f"  {route}: Failed")
    
    print("\n🔧 Troubleshooting Steps:")
    print("1. Visit http://localhost:5174/test - Should show test page")
    print("2. Check browser console for JavaScript errors")
    print("3. Check network tab for failed requests")
    print("4. Verify Firebase config is correct")
    print("5. Check if authentication is blocking the page")
    
    print("\n📊 Debug URLs:")
    print("- Test Page: http://localhost:5174/test")
    print("- Sign In: http://localhost:5174/signin")
    print("- Main App: http://localhost:5174/")
    
    return True

if __name__ == "__main__":
    debug_frontend()
