from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db
from PIL import Image
import pytesseract
import io
import re
from datetime import datetime

router = APIRouter()


@router.post("/ocr/parse")
async def parse_receipt_ocr(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Load and OCR the image
        image = Image.open(io.BytesIO(await file.read()))
        text = pytesseract.image_to_string(image)

        # Normalize lines
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if not lines:
            raise HTTPException(status_code=400, detail="No text found in image.")

        # Initialize defaults
        merchant = lines[0]
        amount = None
        parsed_date = None
        items = []

        # Try to extract total amount from lines
        total_line = next((line for line in lines if "total" in line.lower()), None)
        if total_line:
            amt_match = re.search(r"(\d+\.\d{1,2})", total_line)
            if amt_match:
                amount = float(amt_match.group(1))

        # Try to extract date
        date_match = re.search(r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b", text)
        if date_match:
            try:
                parsed_date = datetime.strptime(date_match.group(1), "%d/%m/%Y")
            except ValueError:
                try:
                    parsed_date = datetime.strptime(date_match.group(1), "%d-%m-%Y")
                except:
                    parsed_date = None

        # Parse items from all lines (skip merchant & total lines)
        for line in lines[1:]:
            if "total" in line.lower():
                continue

            # Match lines like "Item name   3.50"
            match = re.match(r"^(.*\D)\s+(\d+\.\d{1,2})$", line)
            if match:
                name = match.group(1).strip()
                price = float(match.group(2))
                items.append({
                    "name": name,
                    "quantity": 1,
                    "price": price
                })

        return {
            "merchant": merchant,
            "amount": amount,
            "date": parsed_date,
            "items": items
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR parsing failed: {str(e)}")


@router.post("/transactions/add")
def add_transaction(item: dict, db: Session = Depends(get_db)):
    try:
        transaction = models.Transaction(
            user_id=1,  # 🔐 Replace with real user logic if needed
            amount=item["price"],
            description=item["name"],
            date=datetime.now(),
            category="Uncategorized",
            method="Manual Add"
        )
        db.add(transaction)
        db.commit()
        return {"message": "Transaction added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transactions/add-bulk")
def add_bulk_transactions(payload: dict, db: Session = Depends(get_db)):
    try:
        items = payload.get("items", [])
        for item in items:
            transaction = models.Transaction(
                user_id=1,
                amount=item["price"],
                description=item["name"],
                date=datetime.now(),
                category="Uncategorized",
                method="Manual Add"
            )
            db.add(transaction)

        db.commit()
        return {"message": f"{len(items)} transactions added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
