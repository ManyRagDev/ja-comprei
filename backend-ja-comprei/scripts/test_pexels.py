"""
Test script for Pexels integration
"""
import asyncio
from app.services.pexels_service import pexels_service

async def test_pexels():
    print("=" * 50)
    print("Testing Pexels API Integration")
    print("=" * 50)
    
    # Test 1: arroz com frango
    query = "arroz com frango"
    print(f"\nSearching for: {query}")
    result = await pexels_service.search_photo(query)
    
    if result:
        print("SUCCESS!")
        print(f"  Image URL: {result['image_url']}")
        print(f"  Large URL: {result['image_url_large']}")
        print(f"  Photographer: {result['photographer']}")
        print(f"  Avg Color: {result['avg_color']}")
    else:
        print("No result - check if PEXELS_API_KEY is set in .env")
    
    # Test 2: lasanha
    query2 = "lasanha"
    print(f"\nSearching for: {query2}")
    result2 = await pexels_service.search_photo(query2)
    
    if result2:
        print("SUCCESS!")
        print(f"  Image URL: {result2['image_url']}")
        print(f"  Photographer: {result2['photographer']}")
    else:
        print("No result")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    asyncio.run(test_pexels())
