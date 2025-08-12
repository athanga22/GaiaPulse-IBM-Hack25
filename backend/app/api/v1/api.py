"""
API v1 router combining all endpoints
"""
from fastapi import APIRouter
from app.api.v1.endpoints import mood, chat, health

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(mood.router, prefix="/mood", tags=["mood"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(health.router, tags=["health"])
