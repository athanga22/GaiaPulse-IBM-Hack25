"""
Application settings and configuration management
"""
import os
from typing import Optional


class Settings:
    """Application settings with environment variable support"""
    
    def __init__(self):
        # Application
        self.app_name = "GaiaPulse"
        self.app_version = "1.0.0"
        self.debug = os.getenv("DEBUG", "false").lower() == "true"
        
        # Server
        self.host = os.getenv("HOST", "0.0.0.0")
        self.port = int(os.getenv("PORT", "8787"))
        
        # Database
        self.database_url = os.getenv("DATABASE_URL")
        
        # AI/ML Services
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.watsonx_api_key = os.getenv("WATSONX_API_KEY")
        self.watsonx_project_id = os.getenv("WATSONX_PROJECT_ID")
        
        # External APIs
        self.nasa_api_key = os.getenv("NASA_API_KEY")
        self.weather_api_key = os.getenv("WEATHER_API_KEY")
        self.air_quality_api_key = os.getenv("AIR_QUALITY_API_KEY")
        
        # Real-time Data
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.websocket_enabled = os.getenv("WEBSOCKET_ENABLED", "true").lower() == "true"
        
        # Monitoring & Logging
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        self.sentry_dsn = os.getenv("SENTRY_DSN")
        
        # Security
        self.secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
        self.cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:3000").split(",")
        
        # Data Sources
        self.enable_mock_data = os.getenv("ENABLE_MOCK_DATA", "true").lower() == "true"
        self.data_update_interval = int(os.getenv("DATA_UPDATE_INTERVAL", "30"))


# Global settings instance
settings = Settings()
