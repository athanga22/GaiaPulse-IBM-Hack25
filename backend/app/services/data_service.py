"""
Data service for environmental data collection and processing
"""
import logging
import random
import math
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import httpx
from app.config.settings import settings
from app.models.schemas import Point, PulseHistory, EnvironmentalMetric, DataSource

logger = logging.getLogger(__name__)


class DataService:
    """Service for collecting and processing environmental data"""
    
    def __init__(self):
        self.nasa_api_key = settings.nasa_api_key
        self.weather_api_key = settings.weather_api_key
        self.air_quality_api_key = settings.air_quality_api_key
        self.enable_mock_data = settings.enable_mock_data
        
    async def get_current_environmental_data(self) -> Dict[str, Any]:
        """Get current environmental data from various sources"""
        try:
            if self.enable_mock_data:
                return await self._get_mock_environmental_data()
            else:
                return await self._get_real_environmental_data()
        except Exception as e:
            logger.error(f"Error fetching environmental data: {e}")
            return await self._get_mock_environmental_data()
    
    async def _get_mock_environmental_data(self) -> Dict[str, Any]:
        """Generate mock environmental data with realistic variations"""
        base_time = datetime.utcnow()
        
        # Use timestamp to create more varied but realistic data
        time_factor = (base_time.hour + base_time.minute / 60) / 24  # 0-1 over 24 hours
        day_factor = base_time.weekday() / 7  # 0-1 over week
        
        # Simulate realistic environmental data with more variation
        # Temperature varies more throughout the day and week
        base_temp = 15.2
        daily_variation = 3 * math.sin(time_factor * 2 * math.pi)  # Daily cycle
        weekly_variation = 2 * math.sin(day_factor * 2 * math.pi)  # Weekly cycle
        random_variation = random.uniform(-1, 1)
        temperature = base_temp + daily_variation + weekly_variation + random_variation
        
        # CO2 levels with gradual increase trend and some variation
        base_co2 = 420
        trend_increase = (base_time.timestamp() - 1700000000) / 86400 * 0.01  # Gradual increase
        daily_co2_variation = random.uniform(-3, 3)
        co2_levels = base_co2 + trend_increase + daily_co2_variation
        
        # Forest cover with slight decline trend
        base_forest = 31.2
        forest_decline = (base_time.timestamp() - 1700000000) / 86400 * -0.0001  # Very slow decline
        forest_variation = random.uniform(-0.2, 0.2)
        forest_cover = base_forest + forest_decline + forest_variation
        
        # Ocean health with seasonal variation
        base_ocean = 72.0
        seasonal_variation = 2 * math.sin((base_time.timestamp() - 1700000000) / 86400 * 2 * math.pi / 365)  # Yearly cycle
        ocean_variation = random.uniform(-1.5, 1.5)
        ocean_health = base_ocean + seasonal_variation + ocean_variation
        
        return {
            "temperature": round(temperature, 1),
            "co2_levels": round(co2_levels, 1),
            "forest_cover": round(forest_cover, 1),
            "ocean_health": round(ocean_health, 1),
            "air_quality_index": random.randint(35, 95),  # Wider range
            "sea_level_rise": round(3.4 + (base_time.timestamp() - 1700000000) / 86400 * 0.0001 + random.uniform(-0.2, 0.2), 2),
            "biodiversity_index": round(68.5 + random.uniform(-3, 3), 1),
            "renewable_energy_share": round(12.7 + (base_time.timestamp() - 1700000000) / 86400 * 0.001 + random.uniform(-0.8, 0.8), 1),
            "timestamp": base_time,
            "sources": ["mock_data"]
        }
    
    async def _get_real_environmental_data(self) -> Dict[str, Any]:
        """Fetch real environmental data from external APIs"""
        data = {}
        
        # NASA Climate Data
        if self.nasa_api_key:
            try:
                nasa_data = await self._fetch_nasa_climate_data()
                data.update(nasa_data)
            except Exception as e:
                logger.error(f"Error fetching NASA data: {e}")
        
        # Weather Data
        if self.weather_api_key:
            try:
                weather_data = await self._fetch_weather_data()
                data.update(weather_data)
            except Exception as e:
                logger.error(f"Error fetching weather data: {e}")
        
        # Air Quality Data
        if self.air_quality_api_key:
            try:
                air_quality_data = await self._fetch_air_quality_data()
                data.update(air_quality_data)
            except Exception as e:
                logger.error(f"Error fetching air quality data: {e}")
        
        return data
    
    async def _fetch_nasa_climate_data(self) -> Dict[str, Any]:
        """Fetch climate data from NASA APIs"""
        async with httpx.AsyncClient() as client:
            # Example NASA API call (would need actual endpoint)
            response = await client.get(
                "https://api.nasa.gov/planetary/earth/assets",
                params={"api_key": self.nasa_api_key}
            )
            # Process response and return relevant data
            return {"nasa_data": "placeholder"}
    
    async def _fetch_weather_data(self) -> Dict[str, Any]:
        """Fetch weather data from weather APIs"""
        # Implementation would depend on specific weather API
        return {"weather_data": "placeholder"}
    
    async def _fetch_air_quality_data(self) -> Dict[str, Any]:
        """Fetch air quality data from air quality APIs"""
        # Implementation would depend on specific air quality API
        return {"air_quality_data": "placeholder"}
    
    async def get_pulse_history(self, days: int = 7) -> PulseHistory:
        """Get historical pulse data for the specified number of days"""
        try:
            logger.info(f"Generating pulse history for {days} days")
            data_points = []
            base_time = datetime.utcnow()
            
            for i in range(days * 24):  # Hourly data points
                timestamp = base_time - timedelta(hours=i)
                
                # Generate realistic historical data with trends and cycles
                base_temp = 15.0
                # Add daily and weekly cycles to temperature
                hour_of_day = timestamp.hour
                day_of_week = timestamp.weekday()
                daily_cycle = 2 * math.sin((hour_of_day / 24) * 2 * math.pi)
                weekly_cycle = 1 * math.sin((day_of_week / 7) * 2 * math.pi)
                temp_variation = random.uniform(-1.5, 1.5)
                warming_trend = (i * 0.002)  # Gradual warming trend
                temperature = base_temp + daily_cycle + weekly_cycle + temp_variation + warming_trend
                
                base_co2 = 420
                # CO2 with daily patterns (lower during day due to photosynthesis)
                co2_daily_pattern = -2 * math.sin((hour_of_day / 24) * 2 * math.pi)  # Lower during day
                co2_variation = random.uniform(-2, 2)
                co2_trend = (i * 0.015)  # Gradual increase trend
                co2_levels = base_co2 + co2_daily_pattern + co2_variation + co2_trend
                
                # Create data point
                point = Point(
                    timestamp=timestamp,
                    value=round(temperature, 1),
                    unit="°C",
                    source=DataSource.SATELLITE,
                    confidence=0.85 + random.uniform(-0.1, 0.1),
                    metadata={
                        "co2_levels": round(co2_levels, 1),
                        "data_quality": "high"
                    }
                )
                data_points.append(point)
            
            # Reverse to get chronological order
            data_points.reverse()
            
            result = PulseHistory(
                data=data_points,
                period=f"{days}d",
                aggregation="hourly",
                total_points=len(data_points)
            )
            
            logger.info(f"Generated {len(data_points)} data points for pulse history")
            return result
            
        except Exception as e:
            logger.error(f"Error generating pulse history: {e}")
            return PulseHistory(
                data=[],
                period=f"{days}d",
                aggregation="hourly",
                total_points=0
            )
    
    async def get_environmental_metrics(self) -> List[EnvironmentalMetric]:
        """Get current environmental metrics"""
        try:
            data = await self.get_current_environmental_data()
            
            metrics = [
                EnvironmentalMetric(
                    name="Global Temperature",
                    value=data.get("temperature", 15.2),
                    unit="°C",
                    trend="up",
                    change_rate=0.1,
                    threshold=1.5,
                    status="warning",
                    last_updated=datetime.utcnow(),
                    source=DataSource.NASA
                ),
                EnvironmentalMetric(
                    name="CO₂ Levels",
                    value=data.get("co2_levels", 420),
                    unit="ppm",
                    trend="up",
                    change_rate=2.5,
                    threshold=350,
                    status="critical",
                    last_updated=datetime.utcnow(),
                    source=DataSource.SENSOR
                ),
                EnvironmentalMetric(
                    name="Forest Cover",
                    value=data.get("forest_cover", 31.2),
                    unit="%",
                    trend="down",
                    change_rate=-0.1,
                    threshold=30,
                    status="warning",
                    last_updated=datetime.utcnow(),
                    source=DataSource.SATELLITE
                ),
                EnvironmentalMetric(
                    name="Ocean Health",
                    value=data.get("ocean_health", 72),
                    unit="%",
                    trend="up",
                    change_rate=1.2,
                    threshold=70,
                    status="normal",
                    last_updated=datetime.utcnow(),
                    source=DataSource.OCEAN
                )
            ]
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error getting environmental metrics: {e}")
            return []
    
    async def validate_data_quality(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and assess data quality"""
        quality_score = 0.9
        issues = []
        
        # Check for missing data
        required_fields = ["temperature", "co2_levels", "forest_cover", "ocean_health"]
        for field in required_fields:
            if field not in data:
                quality_score -= 0.1
                issues.append(f"Missing {field} data")
        
        # Check for reasonable value ranges
        if data.get("temperature", 0) < -50 or data.get("temperature", 0) > 60:
            quality_score -= 0.2
            issues.append("Temperature out of reasonable range")
        
        if data.get("co2_levels", 0) < 200 or data.get("co2_levels", 0) > 1000:
            quality_score -= 0.2
            issues.append("CO2 levels out of reasonable range")
        
        return {
            "quality_score": max(0, quality_score),
            "issues": issues,
            "timestamp": datetime.utcnow()
        }
