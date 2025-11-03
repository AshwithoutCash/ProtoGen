#!/usr/bin/env python3
"""
Proto-Gen Local AI Stack Startup Script
Orchestrates the startup of all required local AI components
"""

import subprocess
import sys
import time
import requests
import os
from pathlib import Path
from setup_checker import ProtoGenSetupChecker

class LocalAIStarter:
    """Manages startup of local AI stack components."""
    
    def __init__(self):
        self.checker = ProtoGenSetupChecker()
        self.processes = {}
    
    def start_ollama(self):
        """Start Ollama server if not running."""
        print("🦙 Starting Ollama server...")
        
        # Check if already running
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=3)
            if response.status_code == 200:
                print("  ✅ Ollama already running")
                return True
        except:
            pass
        
        # Start Ollama server
        try:
            if sys.platform == "win32":
                # Windows
                process = subprocess.Popen(["ollama", "serve"], 
                                         creationflags=subprocess.CREATE_NEW_CONSOLE)
            else:
                # macOS/Linux
                process = subprocess.Popen(["ollama", "serve"])
            
            self.processes["ollama"] = process
            
            # Wait for server to start
            for i in range(30):
                try:
                    response = requests.get("http://localhost:11434/api/tags", timeout=1)
                    if response.status_code == 200:
                        print("  ✅ Ollama server started successfully")
                        return True
                except:
                    time.sleep(1)
            
            print("  ❌ Ollama server failed to start")
            return False
            
        except FileNotFoundError:
            print("  ❌ Ollama not found. Please install from https://ollama.ai/")
            return False
        except Exception as e:
            print(f"  ❌ Failed to start Ollama: {e}")
            return False
    
    def ensure_ollama_model(self, model="llama3:8b"):
        """Ensure required model is available in Ollama."""
        print(f"🔍 Checking for model: {model}")
        
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get("models", [])
                model_names = [m["name"] for m in models]
                
                if any(model in name for name in model_names):
                    print(f"  ✅ Model {model} already available")
                    return True
                else:
                    print(f"  📥 Pulling model {model}...")
                    result = subprocess.run(["ollama", "pull", model], 
                                          capture_output=True, text=True)
                    if result.returncode == 0:
                        print(f"  ✅ Model {model} pulled successfully")
                        return True
                    else:
                        print(f"  ❌ Failed to pull model: {result.stderr}")
                        return False
        except Exception as e:
            print(f"  ❌ Model check failed: {e}")
            return False
    
    def start_langflow(self):
        """Start Langflow server."""
        print("🌊 Starting Langflow server...")
        
        # Check if already running
        try:
            response = requests.get("http://localhost:7860/health", timeout=3)
            if response.status_code == 200:
                print("  ✅ Langflow already running")
                return True
        except:
            pass
        
        # Start Langflow
        try:
            if sys.platform == "win32":
                process = subprocess.Popen([sys.executable, "-m", "langflow", "run", "--host", "0.0.0.0", "--port", "7860"],
                                         creationflags=subprocess.CREATE_NEW_CONSOLE)
            else:
                process = subprocess.Popen([sys.executable, "-m", "langflow", "run", "--host", "0.0.0.0", "--port", "7860"])
            
            self.processes["langflow"] = process
            
            # Wait for server to start
            for i in range(60):  # Langflow takes longer to start
                try:
                    response = requests.get("http://localhost:7860/health", timeout=1)
                    if response.status_code == 200:
                        print("  ✅ Langflow server started successfully")
                        print("  🌐 Access Langflow at: http://localhost:7860")
                        return True
                except:
                    time.sleep(2)
            
            print("  ❌ Langflow server failed to start within timeout")
            return False
            
        except Exception as e:
            print(f"  ❌ Failed to start Langflow: {e}")
            return False
    
    def start_n8n(self):
        """Start n8n server via Docker."""
        print("🔄 Starting n8n server...")
        
        # Check if already running
        try:
            response = requests.get("http://localhost:5678/rest/login", timeout=3)
            if response.status_code in [200, 401]:
                print("  ✅ n8n already running")
                return True
        except:
            pass
        
        # Start n8n via Docker
        try:
            docker_cmd = [
                "docker", "run", "-d", "--name", "proto-gen-n8n",
                "-p", "5678:5678",
                "-v", "proto_gen_n8n_data:/home/node/.n8n",
                "n8nio/n8n"
            ]
            
            result = subprocess.run(docker_cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                # Wait for server to start
                for i in range(30):
                    try:
                        response = requests.get("http://localhost:5678/rest/login", timeout=1)
                        if response.status_code in [200, 401]:
                            print("  ✅ n8n server started successfully")
                            print("  🌐 Access n8n at: http://localhost:5678")
                            return True
                    except:
                        time.sleep(2)
                
                print("  ❌ n8n server failed to start within timeout")
                return False
            else:
                # Try to start existing container
                start_result = subprocess.run(["docker", "start", "proto-gen-n8n"], 
                                            capture_output=True, text=True)
                if start_result.returncode == 0:
                    print("  ✅ n8n container restarted")
                    return True
                else:
                    print(f"  ❌ Failed to start n8n: {result.stderr}")
                    return False
                    
        except FileNotFoundError:
            print("  ❌ Docker not found. Please install Docker Desktop")
            return False
        except Exception as e:
            print(f"  ❌ Failed to start n8n: {e}")
            return False
    
    def start_all(self):
        """Start all local AI stack components."""
        print("🚀 Starting Proto-Gen Local AI Stack")
        print("=" * 50)
        
        # Run initial check
        results = self.checker.run_full_check()
        
        if all(result["status"] for result in results.values()):
            print("\n🎉 All components already running!")
            return True
        
        print("\n🔧 Starting missing components...")
        
        success = True
        
        # Start Ollama
        if not results["ollama"]["status"]:
            if not self.start_ollama():
                success = False
            else:
                # Ensure model is available
                if not self.ensure_ollama_model():
                    success = False
        
        # Start Langflow
        if not results["langflow"]["status"]:
            if not self.start_langflow():
                success = False
        
        # Start n8n
        if not results["n8n"]["status"]:
            if not self.start_n8n():
                success = False
        
        print("\n" + "=" * 50)
        if success:
            print("🎉 Local AI Stack started successfully!")
            print("\n📋 Next Steps:")
            print("1. Configure Langflow flows: http://localhost:7860")
            print("2. Set up n8n workflows: http://localhost:5678")
            print("3. Start Proto-Gen backend: cd backend && python main.py")
            print("4. Start Proto-Gen frontend: cd frontend && npm run dev")
        else:
            print("❌ Some components failed to start. Check the logs above.")
        
        return success
    
    def stop_all(self):
        """Stop all started processes."""
        print("🛑 Stopping Local AI Stack...")
        
        for name, process in self.processes.items():
            try:
                process.terminate()
                print(f"  ✅ Stopped {name}")
            except:
                print(f"  ❌ Failed to stop {name}")
        
        # Stop n8n container
        try:
            subprocess.run(["docker", "stop", "proto-gen-n8n"], 
                         capture_output=True, text=True)
            print("  ✅ Stopped n8n container")
        except:
            pass

def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Proto-Gen Local AI Stack Manager")
    parser.add_argument("action", choices=["start", "stop", "check"], 
                       help="Action to perform")
    
    args = parser.parse_args()
    
    starter = LocalAIStarter()
    
    if args.action == "start":
        starter.start_all()
    elif args.action == "stop":
        starter.stop_all()
    elif args.action == "check":
        checker = ProtoGenSetupChecker()
        checker.run_full_check()

if __name__ == "__main__":
    main()
