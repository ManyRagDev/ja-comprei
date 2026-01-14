import asyncio
from app.services.pollinations_service import pollinations_service

print("="*50)
print("TESTING GHIBLI STYLE IMAGE GENERATION")
print("="*50)

def test_url_generation():
    tags = [
        "Steak perfectly grilled with fried egg on top",
        "Fish stew in clay pot, vibrant orange sauce",
        "Chocolate truffle balls with sprinkles"
    ]
    
    for tag in tags:
        print(f"\nVisual Tag: {tag}")
        url = pollinations_service.get_ghibli_url(tag)
        print(f"URL: {url}")
        print("-" * 30)
        
    print("\n⚠️ IMPORTANT: Check if POLLINATIONS_API_KEY is present in the URL query params.")

if __name__ == "__main__":
    test_url_generation()
