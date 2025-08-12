#!/usr/bin/env python3
"""
Setup script for configuring real environmental data sources
"""
import os
import sys

def create_env_file():
    """Create a .env file with configuration for real data sources"""
    
    print("🌍 GaiaPulse Real Data Setup")
    print("=" * 40)
    print()
    print("This script will help you set up real environmental data sources.")
    print("You can get free API keys from the following services:")
    print()
    print("🌤️  Weather Data:")
    print("   - OpenWeatherMap: https://openweathermap.org/api")
    print("   - WeatherAPI: https://www.weatherapi.com/")
    print()
    print("🌱 Air Quality Data:")
    print("   - OpenWeatherMap Air Quality: https://openweathermap.org/api/air-pollution")
    print("   - AirVisual: https://www.airvisual.com/api")
    print()
    print("🚀 NASA Climate Data:")
    print("   - NASA API: https://api.nasa.gov/")
    print()
    
    # Get user input
    print("Enter your API keys (press Enter to skip):")
    print()
    
    nasa_key = input("NASA API Key: ").strip()
    weather_key = input("Weather API Key: ").strip()
    air_quality_key = input("Air Quality API Key: ").strip()
    
    # Create .env content
    env_content = f"""# GaiaPulse Environment Configuration
# Disable mock data to use real environmental data
ENABLE_MOCK_DATA=false

# API Keys for real environmental data
NASA_API_KEY={nasa_key or 'your_nasa_api_key_here'}
WEATHER_API_KEY={weather_key or 'your_weather_api_key_here'}
AIR_QUALITY_API_KEY={air_quality_key or 'your_air_quality_api_key_here'}

# AI Services (optional)
OPENAI_API_KEY=your_openai_api_key_here
WATSONX_API_KEY=your_watsonx_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here

# Data update interval (in seconds)
DATA_UPDATE_INTERVAL=30

# Debug mode
DEBUG=true
"""
    
    # Write .env file
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print()
    print("✅ .env file created successfully!")
    print(f"📁 Location: {env_path}")
    print()
    
    if nasa_key or weather_key or air_quality_key:
        print("🎉 Real data sources configured!")
        print("Restart your backend server to use real environmental data.")
    else:
        print("📝 No API keys provided.")
        print("The app will continue using enhanced mock data with realistic variations.")
        print("You can edit the .env file later to add API keys.")
    
    print()
    print("To restart the backend server:")
    print("1. Stop the current server (Ctrl+C)")
    print("2. Run: uvicorn main:app --reload --port 8787")

if __name__ == "__main__":
    create_env_file()
