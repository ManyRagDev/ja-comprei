import sys
import unittest
from unittest.mock import MagicMock

# 1. Mock dependencies that might be missing or fail to load
sys.modules["pydantic_settings"] = MagicMock()
sys.modules["groq"] = MagicMock()
sys.modules["app.core.config"] = MagicMock()

# 2. Setup the mocks
# Config mock
mock_settings = MagicMock()
mock_settings.GROQ_API_KEY = "mock_key"
mock_settings.MODEL_HEAVY = "heavy-model"
mock_settings.MODEL_FAST = "fast-model"
mock_settings.MODEL_AUDIO = "audio-model"

# We need to make sure 'get_settings' returns this mock settings object
sys.modules["app.core.config"].get_settings.return_value = mock_settings

# Groq Mock
mock_groq = sys.modules["groq"]
# We need a proper RateLimitError class that inherits from Exception
class MockRateLimitError(Exception):
    def __init__(self, message, response=None, body=None):
        super().__init__(message)
        self.response = response
        self.body = body

mock_groq.RateLimitError = MockRateLimitError
mock_groq.Groq = MagicMock()

# 3. Now it is safe to import the service, as it will use the mocks
import os
# Ensure we can find the app module (assuming standard structure)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import logic under test
# Note: Since we mocked 'app.core.config', the import in groq_service.py will get our mock
from app.services.groq_service import GroqService

class TestGroqService(unittest.TestCase):
    def setUp(self):
        # Re-instantiate service to ensure it uses our mocks
        self.service = GroqService()
        
    def test_fallback_logic(self):
        print("\n[TEST] Verifying Fallback Mechanism (Fully Mocked)...")
        
        # Setup Client Mock
        self.service.client = MagicMock()
        self.service.client.chat.completions.create = MagicMock()
        
        # Define 429 Error
        error_response = MagicMock()
        error_response.status_code = 429
        rate_limit_error = MockRateLimitError("Rate limit hit", response=error_response)
        
        # Define Success Response
        success_response = MagicMock()
        success_response.choices = [
            MagicMock(message=MagicMock(content='{"status": "fallback_success"}'))
        ]
        
        # Side effect: Error -> Success
        self.service.client.chat.completions.create.side_effect = [
            rate_limit_error,
            success_response
        ]
        
        # Execute
        messages = [{"role": "user", "content": "test"}]
        result = self.service.execute_safe(
            messages,
            primary_model="heavy-model",
            fallback_model="fast-model",
            json_mode=True
        )
        
        # Validation
        self.assertEqual(self.service.client.chat.completions.create.call_count, 2)
        
        calls = self.service.client.chat.completions.create.call_args_list
        print(f"   -> Call 1 Model: {calls[0][1]['model']}")
        print(f"   -> Call 2 Model: {calls[1][1]['model']}")
        
        self.assertEqual(calls[0][1]['model'], "heavy-model")
        self.assertEqual(calls[1][1]['model'], "fast-model")
        
        print("[SUCCESS] Fallback logic verified.")

if __name__ == "__main__":
    unittest.main()
