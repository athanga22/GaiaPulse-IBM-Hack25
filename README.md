# GaiaPulse - Earth's Vital Signs Monitor

GaiaPulse translates complex environmental data into Earth's emotional state, making climate science accessible and engaging through an intuitive, AI-powered interface.

## Features

- **Earth's Mood Visualization**: Real-time animated mood circle showing Earth's current state (Healing/Stressed/Critical)
- **7-Day Pulse History**: Interactive chart tracking environmental trends over time
- **EarthGPT Chatbot**: AI-powered chat interface for environmental insights
- **Environmental Metrics**: Real-time monitoring of key indicators (temperature, CO₂, forest cover, ocean health)
- **Live Updates**: Automatic data polling every 5-10 seconds
- **Responsive Design**: Beautiful interface that works on all devices

## Quick Start

### Prerequisites
Make sure you have these installed:
- **Node.js 18+** (check with `node --version`)
- **Python 3.11+** (check with `python --version`)
- **npm** (comes with Node.js)

### Step 1: Clone & Setup
```bash
# Clone the repository
git clone https://github.com/Ilyes2000/GaiaPulse-IBM-Hack25.git
cd GaiaPulse-IBM-Hack25

# Install frontend dependencies
cd frontend
npm install
```

### Step 2: Start Backend
```bash
# Open a new terminal window/tab
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Mac/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --port 8787
```

### Step 3: Start Frontend
```bash
# Open another terminal window/tab
cd frontend

# Start the development server
npm run dev
```

### Step 4: Access the App
- **Frontend**: Open `http://localhost:5173` in your browser
- **Backend API**: Available at `http://localhost:8787`

### What You'll See
- **Earth's Mood Circle**: Animated visualization of Earth's current state
- **Pulse History Chart**: 7-day environmental trends
- **AI Chat**: Environmental insights chatbot
- **Real-time Stats**: Environmental metrics updating every 20 seconds

### Troubleshooting
- **Port conflicts**: If ports are busy, the servers will tell you which ports to use
- **Python issues**: Make sure you're using Python 3.11+ and have activated the virtual environment
- **Node issues**: Make sure you have Node.js 18+ installed

### Project Structure
```
GaiaPulse-IBM-Hack25/
├── frontend/          # React app (port 5173)
├── backend/           # FastAPI server (port 8787)
└── README.md
```

## Architecture

### Frontend (React + TypeScript)
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling with custom mood-based color schemes
- **Framer Motion** for smooth animations
- **Chart.js** for data visualization
- **React Query** for data fetching and caching
- **Zod** for runtime type validation

### Backend (FastAPI + Python)
- **FastAPI** for high-performance API
- **Pydantic** for data validation
- **CORS** middleware for cross-origin requests
- **Mock data generators** for realistic environmental simulations

## Design Philosophy

GaiaPulse uses psychological metaphors to make environmental data more relatable:
- **Healing**: Calm, slow pulse animation with green gradients
- **Stressed**: Faster pulse with yellow/orange colors
- **Critical**: Red flickering animation for urgent states

## API Endpoints

- `GET /api/current_mood` - Earth's current mood and score
- `GET /api/pulse_history` - 7-day environmental trend data
- `POST /api/chat` - EarthGPT conversation interface

## Development

### Project Structure
```
gaia-pulse/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # React Query hooks
│   │   ├── lib/           # Utilities and API
│   │   └── ...
│   └── ...
├── backend/
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
└── README.md
```

### Key Components
- `MoodCircle`: Central animated visualization
- `PulseHistoryChart`: 7-day trend chart
- `ChatSidebar`: EarthGPT interface
- `StatCard`: Environmental metrics display

## Future Enhancements

- **Real Data Integration**: Connect to actual environmental APIs
- **IBM watsonx.ai**: Integrate with Watson for advanced AI insights
- **Geographic Filtering**: Region-specific environmental data
- **Predictive Analytics**: AI-powered environmental forecasting
- **Mobile App**: Native iOS/Android applications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**GaiaPulse** - Making Earth's heartbeat visible to everyone.
