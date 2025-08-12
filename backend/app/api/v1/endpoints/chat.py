"""
Chat-related API endpoints for AI interactions
"""
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import (
    ChatMessage,
    ChatResponseWrapper,
    ErrorResponse
)
from app.services.ai_service import AIService

router = APIRouter()


async def get_ai_service() -> AIService:
    """Dependency injection for AI service"""
    return AIService()


@router.post(
    "/chat",
    response_model=ChatResponseWrapper,
    responses={
        200: {"description": "Chat response generated successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Chat with AI",
    description="Send a message to the AI assistant for environmental insights"
)
async def chat_with_ai(
    message: ChatMessage,
    ai_service: AIService = Depends(get_ai_service)
) -> ChatResponseWrapper:
    """Chat with AI assistant"""
    try:
        # Validate message
        if not message.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )
        
        # Generate AI response
        response = await ai_service.generate_chat_response(message)
        
        return ChatResponseWrapper(
            success=True,
            data=response,
            message="Chat response generated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating chat response: {str(e)}"
        )
