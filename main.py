
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db
from models import Item as ItemModel

app = FastAPI(title="Lab 1", description="CI/CD API", version="1.0.0")


class Item(BaseModel):
    id: int
    name: str
    description: str = None

    model_config = ConfigDict(from_attributes=True)


@app.get("/")
def root():
    return {"message": "API работает! Перейдите по адресу /docs для просмотра Swagger UI."}


@app.get("/api/items", response_model=list[Item])
def get_items(db: Session = Depends(get_db)):
    return db.query(ItemModel).all()


@app.get("/api/items/{id}", response_model=Item)
def get_item(id: int, db: Session = Depends(get_db)):
    item = db.query(ItemModel).filter(ItemModel.id == id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    return item


@app.post("/api/items", response_model=Item, status_code=201)
def create_item(item: Item, db: Session = Depends(get_db)):
    db_item = ItemModel(
        id=item.id,
        name=item.name,
        description=item.description
    )

    db.add(db_item)

    try:
        db.commit()
        db.refresh(db_item)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Item with this ID already exists"
        )

    return db_item


@app.put("/api/items/{id}", response_model=Item)
def update_item(id: int, updated_item: Item, db: Session = Depends(get_db)):
    db_item = db.query(ItemModel).filter(ItemModel.id == id).first()

    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    db_item.name = updated_item.name
    db_item.description = updated_item.description

    db.commit()
    db.refresh(db_item)

    return db_item


@app.delete("/api/items/{id}", status_code=204)
def delete_item(id: int, db: Session = Depends(get_db)):
    db_item = db.query(ItemModel).filter(ItemModel.id == id).first()

    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(db_item)
    db.commit()

    return None
