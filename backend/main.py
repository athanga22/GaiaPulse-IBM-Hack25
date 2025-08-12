"""
GaiaPulse Backend - Main Entry Point
Environmental Monitoring & AI-Powered Insights
"""
import uvicorn
from app.core.app import app
from app.config.settings import settings

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
