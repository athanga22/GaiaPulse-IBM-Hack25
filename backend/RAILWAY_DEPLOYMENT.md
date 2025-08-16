# Railway Deployment Guide for GaiaPulse Backend

## Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your backend code
- API keys for external services (optional for initial deployment)

## Step 1: Connect Your Repository

1. **Login to Railway** with your GitHub account
2. **Create a new project** → "Deploy from GitHub repo"
3. **Select your repository**: `GaiaPulse-IBM-Hack25`
4. **Set the root directory** to `backend` (important!)

## Step 2: Configure Environment Variables

In your Railway project dashboard, go to **Variables** tab and add:

### Required Variables:
```
DEBUG=false
HOST=0.0.0.0
PORT=8787
SECRET_KEY=your-super-secret-key-change-this-in-production
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000,https://your-frontend-domain.com
LOG_LEVEL=INFO
ENABLE_MOCK_DATA=true
DATA_UPDATE_INTERVAL=30
```

### Optional Variables (for full functionality):
```
OPENAI_API_KEY=your_openai_api_key_here
WATSONX_API_KEY=your_watsonx_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here
NASA_API_KEY=your_nasa_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
AIR_QUALITY_API_KEY=your_air_quality_api_key_here
```

## Step 3: Deploy

1. **Railway will automatically detect** your Python app from `requirements.txt`
2. **The Procfile** tells Railway to run: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Deployment starts automatically** when you push to your main branch

## Step 4: Access Your API

Once deployed, Railway will provide:
- **Production URL**: `https://your-app-name.railway.app`
- **API Documentation**: `https://your-app-name.railway.app/docs`
- **Health Check**: `https://your-app-name.railway.app/api/v1/health`

## Step 5: Update Frontend (if needed)

Update your frontend's API base URL to point to your Railway deployment:
```typescript
// In your frontend config
const API_BASE_URL = 'https://your-app-name.railway.app/api/v1';
```

## Troubleshooting

### Common Issues:

1. **Port Issues**: Railway automatically sets `$PORT` environment variable
2. **CORS Errors**: Update `CORS_ORIGINS` to include your frontend domain
3. **Missing Dependencies**: Check `requirements.txt` is complete
4. **Environment Variables**: Ensure all required vars are set in Railway dashboard

### Logs:
- Check Railway dashboard → **Deployments** → **View Logs**
- Look for any error messages during build or runtime

## Advanced Configuration

### Custom Domain (Optional):
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed

### Environment-Specific Deployments:
- Create separate Railway projects for staging/production
- Use different environment variables for each

## Monitoring

Railway provides:
- **Automatic HTTPS** with SSL certificates
- **Auto-scaling** based on traffic
- **Built-in monitoring** and logs
- **Zero-downtime deployments**

Your API will be available at: `https://your-app-name.railway.app`
