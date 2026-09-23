from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Lab 1 API", description="CI/CD API", version="1.0.0")

class Item(BaseModel):
    id: int
    name: str
    description: str = None

db = []

@app.get("/")
def root():
    return {"message": "API работает! Перейдите по адресу /docs для просмотра Swagger UI."}

@app.get("/api/items", response_model=list[Item])
def get_items():
    return db

@app.get("/api/items/{id}", response_model=Item)
def get_item(id: int):
    item = next((item for item in db if item.id == id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/api/items", response_model=Item, status_code=201)
def create_item(item: Item):
    db.append(item)
    return item

@app.put("/api/items/{id}", response_model=Item)
def update_item(id: int, updated_item: Item):
    for index, item in enumerate(db):
        if item.id == id:
            db[index] = updated_item
            return updated_item
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/api/items/{id}", status_code=204)
def delete_item(id: int):
    global db
    db = [item for item in db if item.id != id]
    return None