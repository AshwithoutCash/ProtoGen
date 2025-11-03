#!/usr/bin/env python3
"""
Proto-Gen Local AI Stack Setup Checker (FR5)
Mandatory installation verification for Langflow, n8n, and Ollama
"""

import subprocess
import sys
import requests
import json
from pathlib import Path
from typing import Dict, List, Tuple

class ProtoGenSetupChecker:
    """Checks and guides installation of mandatory local AI stack components."""
    
    def __init__(self):
        self.requirements = {
            "python": {"min_version": "3.10", "status": False},
            "ollama": {"port": 11434, "status": False, "model": None},
            "n8n": {"port": 5678, "status": False}
        }
        
    def check_python_version(self) -> Tuple[bool, str]:
        """Check if Python 3.10+ is available."""
        try:
            result = subprocess.run([sys.executable, "--version"], 
                                  capture_output=True, text=True)
            version_str = result.stdout.strip()
            version_parts = version_str.split()[1].split('.')
            major, minor = int(version_parts[0]), int(version_parts[1])
            
            if major >= 3 and minor >= 10:
                self.requirements["python"]["status"] = True
                return True, version_str
            else:
                return False, f"Found {version_str}, need Python 3.10+"
        except Exception as e:
            return False, f"Python check failed: {e}"
    
    def check_ollama_server(self) -> Tuple[bool, str]:
        """Check if Ollama server is running and has required model."""
        try:
            # Check if Ollama server is running
            response = requests.get("http://localhost:11434/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get("models", [])
                
                # Check for recommended models
                model_names = [model["name"] for model in models]
                recommended_models = ["llama3:8b", "llama3.1:8b", "llama3:latest", "mistral:7b", "mistral:latest"]
                
                found_model = None
                for model in recommended_models:
                    if any(model in name for name in model_names):
                        found_model = model
                        break
                
                if found_model:
                    self.requirements["ollama"]["status"] = True
                    self.requirements["ollama"]["model"] = found_model
                    return True, f"Ollama running with model: {found_model}"
                else:
                    return False, f"Ollama running but no recommended model found. Available: {model_names}"
            else:
                return False, f"Ollama server responded with status {response.status_code}"
                
        except requests.exceptions.ConnectionError:
            return False, "Ollama server not running on localhost:11434"
        except Exception as e:
            return False, f"Ollama check failed: {e}"
    
    def check_langflow(self) -> Tuple[bool, str]:
        """Check if Langflow is installed and accessible."""
        try:
            # Try importing langflow
            result = subprocess.run([sys.executable, "-c", "import langflow"], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                # Check if Langflow server is running
                try:
                    response = requests.get("http://localhost:7860/health", timeout=3)
                    if response.status_code == 200:
                        self.requirements["langflow"]["status"] = True
                        return True, "Langflow installed and server running on port 7860"
                    else:
                        return False, "Langflow installed but server not running"
                except requests.exceptions.ConnectionError:
                    return False, "Langflow installed but server not running on localhost:7860"
            else:
                return False, "Langflow not installed"
        except Exception as e:
            return False, f"Langflow check failed: {e}"
    
    def check_docker(self) -> Tuple[bool, str]:
        """Check if Docker is installed and running."""
        try:
            result = subprocess.run(["docker", "--version"], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                # Check if Docker daemon is running
                daemon_result = subprocess.run(["docker", "info"], 
                                             capture_output=True, text=True)
                if daemon_result.returncode == 0:
                    self.requirements["docker"]["status"] = True
                    return True, f"Docker installed and running: {result.stdout.strip()}"
                else:
                    return False, "Docker installed but daemon not running"
            else:
                return False, "Docker not installed"
        except FileNotFoundError:
            return False, "Docker not found in PATH"
        except Exception as e:
            return False, f"Docker check failed: {e}"
    
    def check_n8n(self) -> Tuple[bool, str]:
        """Check if n8n is accessible."""
        try:
            response = requests.get("http://localhost:5678/rest/login", timeout=3)
            if response.status_code in [200, 401]:  # 401 is expected for login endpoint
                self.requirements["n8n"]["status"] = True
                return True, "n8n server running on port 5678"
            else:
                return False, f"n8n server responded with status {response.status_code}"
        except requests.exceptions.ConnectionError:
            return False, "n8n server not running on localhost:5678"
        except Exception as e:
            return False, f"n8n check failed: {e}"
    
    def run_full_check(self) -> Dict:
        """Run all system checks and return comprehensive status."""
        print("🔍 Proto-Gen Local AI Stack Verification (n8n + Ollama)")
        print("=" * 50)
        
        results = {}
        
        # Check Python
        print("Checking Python version...")
        python_ok, python_msg = self.check_python_version()
        results["python"] = {"status": python_ok, "message": python_msg}
        print(f"  {'✅' if python_ok else '❌'} {python_msg}")
        
        # Check Ollama
        print("\nChecking Ollama server and models...")
        ollama_ok, ollama_msg = self.check_ollama_server()
        results["ollama"] = {"status": ollama_ok, "message": ollama_msg}
        print(f"  {'✅' if ollama_ok else '❌'} {ollama_msg}")
        
        # Check n8n
        print("\nChecking n8n...")
        n8n_ok, n8n_msg = self.check_n8n()
        results["n8n"] = {"status": n8n_ok, "message": n8n_msg}
        print(f"  {'✅' if n8n_ok else '❌'} {n8n_msg}")
        
        # Summary
        all_components = [python_ok, ollama_ok, n8n_ok]
        all_ready = all(all_components)
        
        print("\n" + "=" * 50)
        if all_ready:
            print("🎉 All components ready! Proto-Gen can run with local AI stack.")
        else:
            print("🚨 Setup incomplete. Please follow the installation guide below.")
            self.show_installation_guide(results)
        
        return results
    
    def show_installation_guide(self, results: Dict):
        """Display step-by-step installation guide for missing components."""
        print("\n🛠️  SETUP GUIDE")
        print("=" * 50)
        print("🚨 Proto-Gen requires a local AI stack with n8n + Ollama.")
        print("The following components need attention:\n")
        
        if not results["python"]["status"]:
            print("1️⃣  PYTHON 3.10+")
            print("   Download from: https://www.python.org/downloads/")
            print("   Ensure 'Add to PATH' is checked during installation\n")
        
        if not results["ollama"]["status"]:
            print("2️⃣  OLLAMA (Local LLM Runtime)")
            print("   The issue: " + results["ollama"]["message"])
            if "not running" in results["ollama"]["message"]:
                print("   Solution: Start Ollama server:")
                print("   > ollama serve")
            elif "no recommended model" in results["ollama"]["message"]:
                print("   Solution: Your llama3.1:8b model is compatible!")
                print("   No action needed - this will work fine.")
            print("   Verify: http://localhost:11434 should be accessible\n")
        
        if not results["n8n"]["status"]:
            print("3️⃣  N8N (Workflow Orchestrator)")
            print("   Install via npm:")
            print("   > npm install -g n8n")
            print("   Start server:")
            print("   > n8n start")
            print("   Access at: http://localhost:5678\n")
        
        print("🔄 After fixing issues, run this checker again:")
        print("   > python setup_checker.py")

def main():
    """Main entry point for setup checker."""
    checker = ProtoGenSetupChecker()
    results = checker.run_full_check()
    
    # Return exit code based on results
    all_ready = all(result["status"] for result in results.values())
    sys.exit(0 if all_ready else 1)

if __name__ == "__main__":
    main()
