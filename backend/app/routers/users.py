from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
import httpx
import os
from dotenv import load_dotenv
from app.schemas import UserCreate  # ✅ Use this instead of undefined UserBase
from fastapi import APIRouter, HTTPException, Request
from google.oauth2 import id_token
from google.auth.transport import requests

load_dotenv()

router = APIRouter()


@router.get("/auth/login")
def login_with_google():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    scope = "openid email profile https://www.googleapis.com/auth/gmail.readonly"

    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?response_type=code"
        f"&client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope={scope}"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return {"url": auth_url}


@router.get("/auth/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(token_url, data=token_data)
        token_json = token_resp.json()
        access_token = token_json.get("access_token")
        refresh_token = token_json.get("refresh_token")

        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")

        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_resp = await client.get("https://www.googleapis.com/oauth2/v3/userinfo", headers=headers)
        profile = userinfo_resp.json()

        email = profile.get("email")
        name = profile.get("name")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found in profile")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(name=name, email=email)
            db.add(user)
            db.commit()
            db.refresh(user)

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }

@router.post("/auth/google")
async def google_login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    token = data.get("token")

    if not token:
        raise HTTPException(status_code=400, detail="Token missing")

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        email = idinfo["email"]
        name = idinfo["name"]
        picture = idinfo.get("picture")

        # Check if user exists in DB
        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(name=name, email=email)
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ Created new user {email}")
        else:
            print(f"ℹ️ User {email} already exists")

        return {
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "picture": picture,
        }

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")
