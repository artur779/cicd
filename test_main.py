from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_item():
    response = client.post("/api/items", json={"id": 1, "name": "Test Item", "description": "Test"})
    assert response.status_code == 201
    assert response.json()["name"] == "Test Item"

def test_get_items():
    response = client.get("/api/items")
    assert response.status_code == 200
    assert isinstance(response.json(), list)