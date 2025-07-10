from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction as TransactionModel, User as UserModel
import pandas as pd
import numpy as np
from datetime import datetime
from dateutil.relativedelta import relativedelta
from sklearn.linear_model import LinearRegression

router = APIRouter()

@router.get("/forecast")
async def forecast(
    user_id: int = Query(..., description="User ID"),
    months_ahead: int = Query(6, ge=1, le=12, description="Number of months to forecast ahead"),
    db: Session = Depends(get_db)
):
    # Check if user exists
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch transactions
    transactions = (
        db.query(TransactionModel)
        .filter(TransactionModel.user_id == user_id)
        .all()
    )
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this user")

    # Create DataFrame
    df = pd.DataFrame([
        {"date": t.date, "amount": t.amount} for t in transactions
    ])
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M")
    monthly_expense = df.groupby("month")["amount"].sum().reset_index()
    monthly_expense["total"] = monthly_expense["amount"].abs()

    # Assign numeric index
    monthly_expense = monthly_expense.sort_values("month")
    monthly_expense["month_num"] = range(len(monthly_expense))

    if len(monthly_expense) < 2:
        raise HTTPException(status_code=400, detail="Not enough data to generate forecast")

    # Linear trend
    X = monthly_expense["month_num"].values.reshape(-1, 1)
    y = monthly_expense["total"].values

    model = LinearRegression()
    model.fit(X, y)

    future_nums = np.arange(len(monthly_expense), len(monthly_expense) + months_ahead).reshape(-1, 1)
    base_preds = model.predict(future_nums)

    # Add seasonality and noise
    seasonal_component = 500 * np.sin(np.linspace(0, np.pi, months_ahead))  # ±500 variation
    noise = np.random.normal(0, 300, months_ahead)  # random noise

    final_preds = base_preds + seasonal_component + noise

    # Avoid negative
    final_preds = np.clip(final_preds, 0, None)

    # Get last month
    last_month = monthly_expense["month"].iloc[-1].to_timestamp()

    # Build forecast list
    forecast_list = []
    for i, pred in enumerate(final_preds):
        forecast_month = (last_month + relativedelta(months=i + 1)).strftime("%Y-%m")
        forecast_list.append({
            "month": forecast_month,
            "predicted_total": round(pred, 2)
        })

    # Add optional actuals if you want to also plot
    actuals = [
        {
            "month": m.strftime("%Y-%m"),
            "actual_total": round(total, 2)
        }
        for m, total in zip(monthly_expense["month"].dt.to_timestamp(), monthly_expense["total"])
    ]

    return {
        "forecast": forecast_list,
        "actuals": actuals,
        "metadata": {
            "method": "linear + seasonal + noise",
            "generated_at": datetime.utcnow().isoformat()
        }
    }
