"""
Mood-related API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.models.schemas import (
    CurrentMoodResponse, 
    PulseHistoryResponse, 
    ErrorResponse,
    CurrentMood,
    PulseHistory
)
from app.services.ai_service import AIService
from app.services.data_service import DataService

router = APIRouter()


async def get_ai_service() -> AIService:
    """Dependency injection for AI service"""
    return AIService()


async def get_data_service() -> DataService:
    """Dependency injection for data service"""
    return DataService()


@router.get(
    "/current_mood",
    response_model=CurrentMoodResponse,
    responses={
        200: {"description": "Current mood data retrieved successfully"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Get Current Earth Mood",
    description="Retrieve the current mood status of Earth based on environmental data analysis"
)
async def get_current_mood(
    ai_service: AIService = Depends(get_ai_service),
    data_service: DataService = Depends(get_data_service)
) -> CurrentMoodResponse:
    """Get current Earth mood status"""
    try:
        # Get environmental data
        env_data = await data_service.get_current_environmental_data()
        
        # Analyze with AI
        mood = await ai_service.analyze_environmental_data(env_data)
        
        return CurrentMoodResponse(
            success=True,
            data=mood,
            message="Current mood data retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving current mood: {str(e)}"
        )


@router.get(
    "/pulse_history",
    response_model=PulseHistoryResponse,
    responses={
        200: {"description": "Pulse history data retrieved successfully"},
        400: {"model": ErrorResponse, "description": "Invalid parameters"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Get Pulse History",
    description="Retrieve historical pulse data for environmental monitoring"
)
async def get_pulse_history(
    days: Optional[int] = 7,
    data_service: DataService = Depends(get_data_service)
) -> PulseHistoryResponse:
    """Get historical pulse data"""
    try:
        # Validate days parameter
        if days is not None and (days < 1 or days > 365):
            raise HTTPException(
                status_code=400,
                detail="Days parameter must be between 1 and 365"
            )
        
        # Get pulse history
        history = await data_service.get_pulse_history(days=days or 7)
        
        return PulseHistoryResponse(
            success=True,
            data=history,
            message=f"Pulse history data retrieved successfully for {days} days"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving pulse history: {str(e)}"
        )
