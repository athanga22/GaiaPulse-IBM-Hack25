# Frontend Deployment Guide

## Update Frontend to Use Railway Backend

### Option 1: Environment Variable (Recommended)

Create a `.env.production` file in your `frontend` directory:

```bash
# frontend/.env.production
VITE_API_URL=https://your-app-name.railway.app
```

### Option 2: Direct Code Update

Update `frontend/src/lib/api.ts` line 4:

```typescript
// Change this line:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

// To this:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-app-name.railway.app'
```

### Option 3: Build-time Environment Variable

When building for production, set the environment variable:

```bash
VITE_API_URL=https://your-app-name.railway.app npm run build
```

## Deploy Frontend

### Option A: Deploy to Railway (Same Project)
1. In your Railway project, add a new service
2. Set root directory to `frontend`
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run preview` (or use a static file server)

### Option B: Deploy to Vercel
1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-app-name.railway.app`

### Option C: Deploy to Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variable: `VITE_API_URL=https://your-app-name.railway.app`

## Test Your Deployment

1. **Check API Connection**: Open browser dev tools and verify API calls go to Railway
2. **Test Chat**: Try the chat functionality
3. **Check Real-time Data**: Verify mood and pulse data updates
4. **CORS Issues**: If you get CORS errors, update your Railway backend's `CORS_ORIGINS` to include your frontend domain

## Environment Variables Summary

### Backend (Railway):
```
DEBUG=false
HOST=0.0.0.0
PORT=8787
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend:
```
VITE_API_URL=https://your-app-name.railway.app
```

## Quick Test Commands

```bash
# Test backend health
curl https://your-app-name.railway.app/api/v1/health

# Test mood endpoint
curl https://your-app-name.railway.app/api/v1/mood/current_mood

# Test chat endpoint
curl -X POST https://your-app-name.railway.app/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "context": "test"}'
```
