import sys
import os

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

try:
    from app.services.groq_service import groq_service
    from app.routers import recipe_router, voice_router
    from app.core.config import get_settings
    
    print("1. Imports Successful.")
    settings = get_settings()
    print(f"2. Config Loaded. Models: {settings.MODEL_HEAVY}, {settings.MODEL_FAST}")

    print("3. Checking Groq Client initialization...")
    assert groq_service.client is not None
    print("   Groq Client OK.")
    
    print("4. Architecture Verification Complete.")
    
except Exception as e:
    print(f"CRITICAL FAILURE: {e}")
    sys.exit(1)
