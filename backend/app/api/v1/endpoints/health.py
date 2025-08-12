"""
Health check and monitoring endpoints
"""
import time
from fastapi import APIRouter, HTTPException
from app.models.schemas import HealthCheck, ErrorResponse
from app.config.settings import settings

router = APIRouter()

# Track startup time for uptime calculation
startup_time = time.time()


@router.get(
    "/health",
    response_model=HealthCheck,
    responses={
        200: {"description": "Service is healthy"},
        503: {"model": ErrorResponse, "description": "Service is unhealthy"}
    },
    summary="Health Check",
    description="Check the health status of the GaiaPulse API"
)
async def health_check() -> HealthCheck:
    """Health check endpoint"""
    try:
        uptime = time.time() - startup_time
        
        # Check dependent services (mock for now)
        services_status = {
            "database": "healthy",
            "ai_service": "healthy",
            "data_service": "healthy",
            "external_apis": "healthy"
        }
        
        # Determine overall status
        overall_status = "healthy" if all(
            status == "healthy" for status in services_status.values()
        ) else "unhealthy"
        
        if overall_status == "unhealthy":
            raise HTTPException(
                status_code=503,
                detail="One or more services are unhealthy"
            )
        
        return HealthCheck(
            status=overall_status,
            timestamp=time.time(),
            version=settings.app_version,
            uptime=uptime,
            services=services_status
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Health check failed: {str(e)}"
        )


@router.get(
    "/ping",
    summary="Simple Ping",
    description="Simple endpoint to check if the service is responding"
)
async def ping() -> dict:
    """Simple ping endpoint"""
    return {"message": "pong", "timestamp": time.time()}
