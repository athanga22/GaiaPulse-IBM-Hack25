# 🛠️ Development Guide

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd GaiaPulse-IBM-Hack25
   npm run install:all
   ```

2. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 5173) and backend (port 8787) simultaneously.

## 🏗️ Architecture Overview

### Frontend (React + TypeScript)
- **Location**: `frontend/`
- **Port**: 5173 (Vite dev server)
- **Key Technologies**:
  - React 18 with TypeScript
  - Vite for fast development
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Chart.js for data visualization
  - React Query for data management

### Backend (FastAPI + Python)
- **Location**: `backend/`
- **Port**: 8787
- **Key Technologies**:
  - FastAPI for API framework
  - Pydantic for data validation
  - Uvicorn for ASGI server
  - Mock data generators for realistic simulations

## 📁 Project Structure

```
GaiaPulse-IBM-Hack25/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Header.tsx      # App header with branding
│   │   │   ├── MoodCircle.tsx  # Central mood visualization
│   │   │   ├── PulseHistoryChart.tsx # 7-day trend chart
│   │   │   ├── ChatSidebar.tsx # EarthGPT interface
│   │   │   ├── StatCard.tsx    # Environmental metrics
│   │   │   └── Dashboard.tsx   # Main dashboard layout
│   │   ├── hooks/              # React Query hooks
│   │   │   ├── useCurrentMood.ts
│   │   │   └── usePulseHistory.ts
│   │   ├── lib/                # Utilities and API
│   │   │   ├── api.ts          # API functions and schemas
│   │   │   └── utils.ts        # Utility functions
│   │   ├── App.tsx             # Main app component
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.ts          # Vite configuration
│   └── tailwind.config.js      # Tailwind configuration
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── .venv/                  # Python virtual environment
├── package.json                # Root package.json with scripts
├── README.md                   # Project overview
└── DEVELOPMENT.md              # This file
```

## 🔧 Development Workflow

### Frontend Development
1. **Component Development**: Create new components in `frontend/src/components/`
2. **Styling**: Use Tailwind CSS classes and custom components
3. **State Management**: Use React Query for server state, React state for UI state
4. **API Integration**: Add new API functions in `frontend/src/lib/api.ts`

### Backend Development
1. **API Endpoints**: Add new endpoints in `backend/main.py`
2. **Data Models**: Define Pydantic models for request/response validation
3. **Mock Data**: Enhance mock data generators for realistic simulations

### Adding New Features
1. **Frontend**: Create component → Add to Dashboard → Style with Tailwind
2. **Backend**: Add endpoint → Define models → Generate mock data
3. **Integration**: Update API functions → Add React Query hooks → Test

## 🎨 Design System

### Color Palette
- **Healing**: Green gradients (`healing-400` to `healing-600`)
- **Stressed**: Yellow/Orange (`stressed-400` to `stressed-600`)
- **Critical**: Red (`critical-400` to `critical-600`)
- **Neutral**: White/transparent overlays

### Animations
- **Healing**: Slow, calm pulse (`animate-pulse-slow`)
- **Stressed**: Faster pulse (`animate-pulse-fast`)
- **Critical**: Flickering effect (`animate-flicker`)

### Components
- **StatCard**: Reusable metric display with icons and trends
- **MoodCircle**: Central animated visualization
- **ChatSidebar**: Slide-in chat interface

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
source .venv/bin/activate
pytest
```

### API Testing
```bash
# Test backend endpoints
curl http://localhost:8787/api/current_mood
curl http://localhost:8787/api/pulse_history
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How is Earth feeling?"}'
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
# Deploy with requirements.txt and main.py
```

## 🔍 Debugging

### Frontend Issues
- Check browser console for errors
- Verify API endpoints are accessible
- Check React Query devtools for data flow

### Backend Issues
- Check uvicorn logs for errors
- Verify CORS settings
- Test endpoints with curl or Postman

### Common Issues
1. **CORS Errors**: Ensure backend CORS middleware is configured
2. **API Timeouts**: Check React Query retry settings
3. **Styling Issues**: Verify Tailwind classes and custom CSS

## 📚 Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request

---

Happy coding! 🌍💚
