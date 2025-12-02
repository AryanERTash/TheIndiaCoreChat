#!/usr/bin/env python3
"""
Test script for conversation history endpoint
Tests Requirements 13.2, 13.3, 13.5
"""

import json
import urllib.parse
import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_empty_history():
    """Test 1: Request with empty history"""
    print("\n=== Test 1: Empty History ===")
    
    params = {
        "q": "Hello, who are you?",
        "sys": "You are a helpful assistant."
    }
    
    response = requests.get(f"{BASE_URL}/chat", params=params)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Response: {data.get('response', '')[:100]}...")
    
    assert data.get('success') == True, "Request should succeed"
    assert data.get('response'), "Should have a response"
    print("✓ Test 1 passed")


def test_single_turn_history():
    """Test 2: Request with single-turn conversation history"""
    print("\n=== Test 2: Single-Turn History ===")
    
    history = [
        {
            "role": "user",
            "content": "My name is Alice",
            "timestamp": "2025-11-22T10:00:00.000Z"
        },
        {
            "role": "assistant",
            "content": "Nice to meet you, Alice!",
            "timestamp": "2025-11-22T10:00:05.000Z"
        }
    ]
    
    history_json = json.dumps(history)
    history_encoded = urllib.parse.quote(history_json)
    
    params = {
        "q": "What is my name?",
        "sys": "You are a helpful assistant.",
        "history": history_encoded
    }
    
    response = requests.get(f"{BASE_URL}/chat", params=params)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Response: {data.get('response', '')}")
    
    assert data.get('success') == True, "Request should succeed"
    assert data.get('response'), "Should have a response"
    # Check if response mentions Alice (contextual understanding)
    response_text = data.get('response', '').lower()
    print(f"Contains 'alice': {'alice' in response_text}")
    print("✓ Test 2 passed")


def test_multi_turn_history():
    """Test 3: Request with multi-turn conversation history"""
    print("\n=== Test 3: Multi-Turn History ===")
    
    history = [
        {
            "role": "user",
            "content": "I'm planning a trip to India",
            "timestamp": "2025-11-22T10:00:00.000Z"
        },
        {
            "role": "assistant",
            "content": "That's wonderful! India has many beautiful places to visit.",
            "timestamp": "2025-11-22T10:00:05.000Z"
        },
        {
            "role": "user",
            "content": "I'm interested in Maharashtra",
            "timestamp": "2025-11-22T10:01:00.000Z"
        },
        {
            "role": "assistant",
            "content": "Maharashtra is a great choice! It has Mumbai, Pune, and many historical sites.",
            "timestamp": "2025-11-22T10:01:05.000Z"
        }
    ]
    
    history_json = json.dumps(history)
    history_encoded = urllib.parse.quote(history_json)
    
    params = {
        "q": "What cuisine should I try there?",
        "sys": "You are a helpful assistant.",
        "history": history_encoded
    }
    
    response = requests.get(f"{BASE_URL}/chat", params=params)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Response: {data.get('response', '')}")
    
    assert data.get('success') == True, "Request should succeed"
    assert data.get('response'), "Should have a response"
    # Check if response is contextual (mentions Maharashtra cuisine)
    response_text = data.get('response', '').lower()
    print(f"Contextual response (mentions maharashtra/indian food): {any(word in response_text for word in ['maharashtra', 'vada', 'pav', 'misal', 'indian'])}")
    print("✓ Test 3 passed")


def test_max_history_size():
    """Test 4: Request with maximum history size (50 messages)"""
    print("\n=== Test 4: Maximum History Size (50 messages) ===")
    
    # Create 50 messages (25 exchanges)
    history = []
    for i in range(25):
        history.append({
            "role": "user",
            "content": f"Message {i*2}",
            "timestamp": f"2025-11-22T10:{i:02d}:00.000Z"
        })
        history.append({
            "role": "assistant",
            "content": f"Response {i*2+1}",
            "timestamp": f"2025-11-22T10:{i:02d}:05.000Z"
        })
    
    history_json = json.dumps(history)
    history_encoded = urllib.parse.quote(history_json)
    
    print(f"History size: {len(history)} messages")
    print(f"Encoded history length: {len(history_encoded)} characters")
    
    params = {
        "q": "Can you summarize our conversation?",
        "sys": "You are a helpful assistant.",
        "history": history_encoded
    }
    
    response = requests.get(f"{BASE_URL}/chat", params=params)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Response: {data.get('response', '')[:150]}...")
    
    assert data.get('success') == True, "Request should succeed with max history"
    assert data.get('response'), "Should have a response"
    print("✓ Test 4 passed")


def test_malformed_history():
    """Test 5: Request with malformed history (should gracefully handle)"""
    print("\n=== Test 5: Malformed History ===")
    
    params = {
        "q": "Hello",
        "sys": "You are a helpful assistant.",
        "history": "invalid-json-data"
    }
    
    response = requests.get(f"{BASE_URL}/chat", params=params)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Response: {data.get('response', '')[:100]}...")
    
    # Should still succeed, just without history
    assert data.get('success') == True, "Request should succeed even with malformed history"
    assert data.get('response'), "Should have a response"
    print("✓ Test 5 passed (gracefully handled malformed history)")


def main():
    print("Starting Conversation History Endpoint Tests")
    print("=" * 50)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        print(f"✓ Server is running (health check: {response.json()})")
    except requests.exceptions.RequestException as e:
        print(f"✗ Server is not running. Please start it with:")
        print(f"  python -m uvicorn gemini_endpoint:app --host 127.0.0.1 --port 8000")
        return
    
    try:
        test_empty_history()
        time.sleep(1)
        
        test_single_turn_history()
        time.sleep(1)
        
        test_multi_turn_history()
        time.sleep(1)
        
        test_max_history_size()
        time.sleep(1)
        
        test_malformed_history()
        
        print("\n" + "=" * 50)
        print("✓ All tests passed!")
        print("=" * 50)
        
    except AssertionError as e:
        print(f"\n✗ Test failed: {e}")
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")


if __name__ == "__main__":
    main()
