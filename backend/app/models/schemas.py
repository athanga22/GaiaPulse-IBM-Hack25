"""
Pydantic schemas for API requests and responses
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from enum import Enum


class MoodType(str, Enum):
    """Earth's mood states"""
    HEALING = "healing"
    STRESSED = "stressed"
    CRITICAL = "critical"


class DataSource(str, Enum):
    """Data source types"""
    NASA = "nasa"
    WEATHER = "weather"
    AIR_QUALITY = "air_quality"
    OCEAN = "ocean"
    FOREST = "forest"
    SATELLITE = "satellite"
    SENSOR = "sensor"
    AI_PREDICTION = "ai_prediction"


class Point(BaseModel):
    """Data point for time series"""
    timestamp: datetime = Field(..., description="Timestamp of the data point")
    value: float = Field(..., description="Numeric value")
    unit: str = Field(..., description="Unit of measurement")
    source: DataSource = Field(..., description="Data source")
    confidence: Optional[float] = Field(None, ge=0, le=1, description="Confidence score (0-1)")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class CurrentMood(BaseModel):
    """Current Earth mood status"""
    mood: MoodType = Field(..., description="Current mood state")
    score: float = Field(..., ge=0, le=100, description="Mood score (0-100)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Last updated timestamp")
    predictive_statement: str = Field(..., description="AI-generated predictive statement")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence")
    factors: List[str] = Field(..., description="Factors influencing current mood")
    trend: str = Field(..., description="Trend direction (improving, declining, stable)")
    next_update: datetime = Field(..., description="Next scheduled update")


class PulseHistory(BaseModel):
    """Historical pulse data"""
    data: List[Point] = Field(..., description="Time series data points")
    period: str = Field(..., description="Time period (7d, 30d, 1y)")
    aggregation: str = Field(..., description="Data aggregation method")
    total_points: int = Field(..., description="Total number of data points")


class EnvironmentalMetric(BaseModel):
    """Environmental metric data"""
    name: str = Field(..., description="Metric name")
    value: float = Field(..., description="Current value")
    unit: str = Field(..., description="Unit of measurement")
    trend: str = Field(..., description="Trend direction")
    change_rate: float = Field(..., description="Rate of change")
    threshold: Optional[float] = Field(None, description="Alert threshold")
    status: str = Field(..., description="Status (normal, warning, critical)")
    last_updated: datetime = Field(..., description="Last update timestamp")
    source: DataSource = Field(..., description="Data source")


class ChatMessage(BaseModel):
    """Chat message for AI interaction"""
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Message timestamp")


class ChatResponse(BaseModel):
    """AI chat response"""
    response: str = Field(..., description="AI response message")
    confidence: float = Field(..., ge=0, le=1, description="Response confidence")
    sources: List[str] = Field(..., description="Data sources used")
    suggestions: List[str] = Field(..., description="Follow-up suggestions")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")


class Alert(BaseModel):
    """Environmental alert"""
    id: str = Field(..., description="Unique alert ID")
    type: str = Field(..., description="Alert type")
    severity: str = Field(..., description="Severity level")
    message: str = Field(..., description="Alert message")
    location: Optional[str] = Field(None, description="Geographic location")
    timestamp: datetime = Field(..., description="Alert timestamp")
    resolved: bool = Field(default=False, description="Alert resolution status")


class HealthCheck(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    timestamp: datetime = Field(..., description="Check timestamp")
    version: str = Field(..., description="API version")
    uptime: float = Field(..., description="Service uptime in seconds")
    services: Dict[str, str] = Field(..., description="Dependent services status")


# API Response Models
class CurrentMoodResponse(BaseModel):
    """API response for current mood"""
    success: bool = Field(..., description="Request success status")
    data: CurrentMood = Field(..., description="Current mood data")
    message: str = Field(..., description="Response message")


class PulseHistoryResponse(BaseModel):
    """API response for pulse history"""
    success: bool = Field(..., description="Request success status")
    data: PulseHistory = Field(..., description="Pulse history data")
    message: str = Field(..., description="Response message")


class ChatResponseWrapper(BaseModel):
    """API response for chat"""
    success: bool = Field(..., description="Request success status")
    data: ChatResponse = Field(..., description="Chat response data")
    message: str = Field(..., description="Response message")


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = Field(default=False, description="Request success status")
    error: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
