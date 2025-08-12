Refining our Project Pitch
our core idea is strong, but let's sharpen the language to make it even more impactful for the
judges.
●
●
●
Focus on the "Why": You've nailed the "what" and the "how,
" but a great pitch also
emphasizes the "why now.
" The world is saturated with environmental data, but it's often
fragmented and hard for people to understand. GaiaPulse solves this by creating a
unified, emotional, and intuitive interface. This positions your project not just as a cool
idea, but as a necessary solution to a real-world problem.
Elevate the Metaphor: The "Earth's heartbeat" and "planetary mood" metaphors are
excellent. They're what make your project unique. You can build on this by talking about
the specific metrics you'll use. For example, a sudden spike in CO₂ could be like a fever,
while widespread deforestation could be a wound. These vivid comparisons will make
your project unforgettable.
Highlight the Technical Prowess: You've listed the IBM tech stack, which is great.
Now, tie it directly back to your project's unique features. For example:
○
watsonx.ai & Granite Models: Explain that these are the engine behind the
"psychological metaphors.
" They are what allow you to translate raw numbers
into emotional states like "calm" or "stressed.
"
○
RAG: Position this as the key to your EarthGPT feature, enabling the system to
pull specific, up-to-the-minute data to answer a user's question, making the
response highly relevant and data-backed.
Building Out Your MVP Plan
Your MVP plan is solid and achievable for a hackathon. To make it even more impressive,
consider these additions:
●
●
Visualizing the "Pulse": Instead of just showing a graph, think about a more creative
visualization. A simple, pulsing graphic that changes color (e.g., green for "calm,
" red for
"critical") and rhythm (slow pulse for calm, fast for stressed) would be a powerful and
immediate visual representation of Earth's "mood.
"
Defining the Mood States: Be specific about what constitutes each mood state. For
example:
○
Healing: Declining CO₂ in a region, increasing protected land, or reforestation
○
○
efforts.
Under Pressure: Steady increase in temperature, moderate deforestation, or
rising urban noise.
Critical: Rapidly accelerating CO₂ increase, uncontrolled forest fires, or a major
oil spill.
●
●
This shows the judges you've thought about the underlying logic and are not just
randomly assigning labels.
Showcasing the Chatbot: Make the chatbot demo the centerpiece of your presentation.
Start with a simple question and then move to a more complex one that requires the AI
to synthesize multiple data points.
○
Simple: "How are you feeling?"
→ AI responds with the current mood.
○
Complex: "Why are you feeling stressed in the Pacific region?"
→ AI responds
by pulling data on a recent marine heatwave and a specific deforestation event in
a nearby coastal area. This demonstrates the power of RAG.
Bonus "WTF" Features
Your "WTF" features are what will set you apart. Here are a few more ideas to push the concept
even further:
●
●
Historical Timeline: Go beyond a 7-day history. Imagine a feature that allows users to
see a "mood history" of a specific location over the last 50 years, showing the long-term
impact of climate change. This would be a powerful storytelling tool.
Impact Simulation: A feature that allows a user or policymaker to ask,
"What would
happen to the Amazon's mood if we planted 1 million trees?" The AI could then simulate
the potential positive shift, providing a tangible goal for conservation efforts.

## **1) Complete Tech Stack**

**Frontend**

* React + Vite
* Tailwind CSS
* shadcn/ui (cards, modal, sidebar)
* Framer Motion (pulse animations)
* Chart.js + react-chartjs-2 (line chart)

**State/Data**

* React Query (polling every 5–10s)
* Zod (API response validation)

**Chat UI**

* Custom + shadcn `Sheet` sidebar

**Backend**

* Python 3.11+
* FastAPI + Uvicorn (ASGI)
* Pydantic (schemas)
* python-dotenv (env management)
* httpx (future WatsonX API calls)
* CORS middleware

**Build/Deploy**

* Vercel (frontend)
* Render/Fly.io/Railway (backend)

**Optional Dev QoL**

* ESLint + Prettier (frontend)
* Ruff or Black (backend)
* dotenv files

---

## **2) Features & Stories (from your spec)**

### **A. One-Page SPA layout**

**Story A1 — Header & Footer**

* Header: “GaiaPulse” + small logo
* Footer: Team names + “Powered by IBM watsonx”
  **Done when:** Responsive, mobile/desktop, no scroll jank.

**Story A2 — Main Dashboard shell**

* Desktop: Left = mood viz + history, Right = quick stats
* Mobile: Stacked layout
  **Done when:** No layout shift (CLS ≈ 0)

---

### **B. Central “Earth’s Mood” Visualization**

**Story B1 — Mood Badge**

* Large animated circle
* *Healing* → calm pulse; *Stressed* → faster pulse; *Critical* → red flicker
* Framer Motion + Tailwind color classes
  **Done when:** Reacts to `/api/current_mood.mood`

**Story B2 — Predictive Statement**

* Under circle: one-liner from API
  **Done when:** Updates every fetch; max 140 chars

---

### **C. Pulse History Graph**

**Story C1 — Chart.js Line Graph**

* X: date (7 points)
* Y: mood score (0–1)
* Tooltip: date + score + mood label
  **Done when:** Interactive, works with mock data

**Story C2 — Smooth Updates**

* Refetch `/api/pulse_history` every 10s
  **Done when:** Animates in without flicker

---

### **D. EarthGPT Chatbot (Sidebar)**

**Story D1 — Sidebar UI**

* shadcn `Sheet` slides in from right
* Input at bottom, messages scroll
  **Done when:** ESC closes, state preserved

**Story D2 — Chat Flow**

* Send → POST `/api/chat {message}`
* Loader bubble until reply arrives
  **Done when:** Handles errors with toast

---

### **E. Data & API Integration**

**Story E1 — Poll Current Mood**

* GET `/api/current_mood` every 5s
* Map mood → visuals
  **Done when:** Retry/backoff works

**Story E2 — History Fetch**

* GET `/api/pulse_history` on mount + every 10s
  **Done when:** Zod validates; bad data → fallback

**Story E3 — Swap mock → real**

* Change only `API_BASE_URL` in `.env`
  **Done when:** No frontend code edits needed

---

## **3) Dev Documentation**

### **3.1 Folder Structure**

```
gaia-pulse/
  frontend/
    src/
      components/
        Header.tsx
        MoodCircle.tsx
        PulseHistoryChart.tsx
        ChatSidebar.tsx
        StatCard.tsx
      hooks/
        useCurrentMood.ts
        usePulseHistory.ts
      lib/
        api.ts
        mood.ts
      pages/
        Dashboard.tsx
      App.tsx
      main.tsx
    index.html
    .env.example
  backend/
    main.py
    requirements.txt
    .env.example
  package.json (frontend)
  README.md
```

---

### **3.2 API Contracts** (same for mock & real)

**GET `/api/current_mood`**

```json
{
  "mood": "Healing",
  "score": 0.72,
  "predictive_statement": "Rainfall recovery suggests short-term relief in CO₂ hotspots.",
  "ts": "2025-08-11T19:00:00Z"
}
```

**GET `/api/pulse_history`**

```json
{
  "points": [
    {"date": "2025-08-05", "score": 0.55},
    {"date": "2025-08-06", "score": 0.58}
  ]
}
```

**POST `/api/chat`**

```json
{"message":"How is Earth doing today?"}
```

**Response**

```json
{"reply":"Earth is healing in several regions, but deforestation pressure remains elevated in the Amazon."}
```

---

### **3.3 Backend (FastAPI)**

**`requirements.txt`**

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
pydantic==2.8.2
python-dotenv==1.0.1
httpx==0.27.0
```

**`main.py`**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import date, datetime, timedelta
import os

app = FastAPI(title="GaiaPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOODS = ["Healing", "Stressed", "Critical"]

class CurrentMood(BaseModel):
    mood: str = Field(pattern="|".join(MOODS))
    score: float = Field(ge=0, le=1)
    predictive_statement: str
    ts: str

class Point(BaseModel):
    date: str
    score: float

class PulseHistory(BaseModel):
    points: list[Point]

class ChatIn(BaseModel):
    message: str

class ChatOut(BaseModel):
    reply: str

@app.get("/api/current_mood", response_model=CurrentMood)
def get_current_mood():
    return CurrentMood(
        mood="Healing",
        score=0.72,
        predictive_statement="Rainfall recovery suggests short-term relief in CO₂ hotspots.",
        ts=datetime.utcnow().isoformat() + "Z"
    )

@app.get("/api/pulse_history", response_model=PulseHistory)
def get_pulse_history():
    today = date.today()
    points = [
        Point(date=(today - timedelta(days=6-i)).isoformat(), score=0.55 + i*0.01)
        for i in range(7)
    ]
    return PulseHistory(points=points)

@app.post("/api/chat", response_model=ChatOut)
def chat(body: ChatIn):
    return ChatOut(reply=f"Earth says: '{body.message}' echoes hope — Healing, but stay vigilant.")
```

Run:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8787
```

---

### **3.4 Frontend Setup**

```bash
cd frontend
npm create vite@latest frontend -- --template react-ts
npm i @tanstack/react-query zod chart.js react-chartjs-2 framer-motion class-variance-authority lucide-react
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

In `vite.config.ts`:

```ts
server: {
  proxy: { "/api": { target: "http://localhost:8787", changeOrigin: true } }
}
```

`.env`

```
VITE_API_BASE_URL=/api
```

---

### **3.5 Fetch Helper**

Same as before (`lib/api.ts`), but `base` points to FastAPI backend.

---

### **3.6 Day Build Plan**

* **Hour 0–2:** Scaffold React + Tailwind, header/footer, layout shell
* **Hour 2–4:** Mood circle animation + predictive text
* **Hour 4–5:** Chart.js with mock `/pulse_history` data
* **Hour 5–6:** React Query polling + Zod validation
* **Hour 6–7:** Chat sidebar + POST `/api/chat`
* **Hour 7–8:** Responsive polish, error/loading states, deploy


