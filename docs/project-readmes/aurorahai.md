# AuroraHai — Hyper-Local Aurora Forecasting & Astrophotographer Intelligence Platform

> **"Can I see and photograph aurora from my location right now, and what should I do to maximize that chance?"**

AuroraHai is a real-time aurora intelligence platform that connects **space weather telemetry** with **local visibility conditions** to provide hyper-local aurora predictions for photographers and observers. Built for the **Orion Astrathon** hackathon.

---

## Features

### Core
- **Live Data Pipeline** — Ingests real-time NOAA DSCOVR/ACE solar wind, OVATION aurora model, Kp index, and geomagnetic alerts with automatic failover and schema change detection
- **Interactive Aurora Map** — Dynamic OVATION probability overlay on a dark-themed map with aurora oval boundary, day/night terminator, user location, and click-to-inspect popups
- **Visibility Score Engine** — Composite 0–100 score combining aurora probability (50%), sky darkness (30%), and cloud clarity (20%) with full sub-component breakdown
- **Alert System** — Real-time WebSocket push for solar wind events and substorm warnings with configurable threshold subscriptions

### Stretch Goals
- **GPS Route Optimizer** — Finds top 5 optimal viewing spots by searching concentric rings (10–200 km) for dark, clear, aurora-active locations
- **Substorm Early Warning** — Monitors dBz/dt rate of change to detect substorm onset 5–15 minutes before peak
- **Community Sightings** — Submit and browse geo-tagged aurora sighting reports
- **Photography Advisor** — Recommends camera settings (ISO, aperture, shutter speed) based on aurora intensity classification

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11+, FastAPI, Pydantic V2, httpx, uvicorn |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Zustand |
| **Map** | MapLibre GL JS with CARTO dark basemap tiles |
| **Charts** | Recharts |
| **UI Components** | Radix UI + Shadcn/ui |
| **Real-time** | WebSocket (native FastAPI) |
| **Data Sources** | NOAA SWPC, Open-Meteo, IDA Dark Sky database |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  Dashboard │ Aurora Map │ Solar Wind │ Photography │ Community│
└─────────────────────────┬───────────────────────────────────┘
                          │  REST + WebSocket
┌─────────────────────────┴───────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  /api/solar-wind  /api/aurora  /api/visibility  /api/weather│
│  /api/alerts      /api/sightings       /ws/live             │
└────────┬────────────────┬───────────────────────────────────┘
         │                │
┌────────┴────────┐ ┌─────┴──────────────────────────────────┐
│   AI Engine     │ │       Data Pipeline                     │
│  Visibility     │ │  Collectors → Processors → Storage      │
│  Substorm       │ │  NOAA Solar Wind (1 min)                │
│  Classifier     │ │  NOAA OVATION (30 min)                  │
│  Route Opt.     │ │  NOAA Kp Index (3 hr)                   │
│  Photo Advisor  │ │  Open-Meteo Weather (cached 15 min)     │
└─────────────────┘ │  Light Pollution (heuristic)            │
                    └─────────────────────────────────────────┘
```

---

## Data Sources

| Source | Endpoint | Data | Update Frequency |
|--------|----------|------|-----------------|
| NOAA DSCOVR | `solar-wind/mag-1-day.json` | IMF Bx, By, Bz, Bt | 1 minute |
| NOAA DSCOVR | `solar-wind/plasma-1-day.json` | Wind speed, density, temperature | 1 minute |
| NOAA OVATION | `ovation_aurora_latest.json` | Aurora probability grid (360x181) | 30 minutes |
| NOAA Kp | `noaa-planetary-k-index.json` | Kp index (0–9) | 3 hours |
| NOAA Alerts | `alerts.json` | Geomagnetic storm alerts | Event-driven |
| Open-Meteo | `/v1/forecast` | Cloud cover, humidity, wind, temperature | On-demand (15 min cache) |
| IDA Dark Sky | Hardcoded database | Bortle class estimation | Static |                                                                                                        

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/Aurora-ForeCasting-Intelligence-Platform.git
cd Aurora-ForeCasting-Intelligence-Platform

# Run the setup script (installs Python + Node dependencies, creates .env)
bash scripts/setup.sh

# Or manually:
pip install -r backend/requirements.txt
cd frontend && npm install && cd ..
cp .env.example .env
```

### Configuration

Edit `.env` and add your API keys:

```env
# Required for map tiles (get free token at mapbox.com)
MAPBOX_ACCESS_TOKEN=your_token_here

# Optional (for enhanced astronomy data)
ASTRONOMY_API_ID=your_id
ASTRONOMY_API_SECRET=your_secret
```

> **Note:** NOAA and Open-Meteo APIs are public and require no API keys.

### Run

```bash
# Start both backend and frontend
bash scripts/dev.sh

# Or start separately:

# Terminal 1 — Backend (FastAPI on port 8000)
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — Frontend (Vite on port 5173)
cd frontend && npm run dev
```

### Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/health |

---

## Project Structure

```
Aurora-ForeCasting-Intelligence-Platform/
├── config/                     # Shared configuration
│   ├── settings.py            #   Pydantic settings (env vars)
│   └── api_endpoints.json     #   External API URLs
│
├── data_pipeline/              # Real-time data ingestion layer
│   ├── collectors/            #   NOAA, weather, light pollution fetchers
│   ├── processors/            #   Solar wind, OVATION, weather, darkness
│   ├── schemas/               #   Pydantic V2 data models
│   ├── storage/               #   In-memory cache + rolling data store
│   ├── utils/                 #   Async HTTP client, validators
│   └── pipeline_runner.py     #   Standalone orchestrator
│
├── ai_engine/                  # Scoring & prediction algorithms
│   ├── models/                #   Visibility scorer, substorm detector,
│   │                          #   aurora classifier, route optimizer
│   ├── inference/             #   Score engine, substorm engine, photo advisor
│   ├── utils/                 #   Astronomy, geo-spatial, math utilities
│   └── data/                  #   Bortle scale, camera profiles (JSON)
│
├── backend/                    # FastAPI REST + WebSocket server
│   ├── app/
│   │   ├── main.py           #   App entry, CORS, WebSocket, routers
│   │   ├── api/routes/       #   6 route modules (21 endpoints)
│   │   └── core/             #   Config, background scheduler
│   └── requirements.txt
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/            #   Dashboard, MapView, SolarWind, Photography, Community
│   │   ├── components/       #   Layout, dashboard, map, chart, photo, UI primitives
│   │   ├── hooks/            #   Geolocation, visibility, WebSocket, solar wind
│   │   ├── stores/           #   Zustand global state
│   │   ├── api/              #   Typed API client
│   │   └── types/            #   TypeScript interfaces
│   └── package.json
│
├── scripts/                    # Development scripts
│   ├── setup.sh              #   First-time setup
│   ├── dev.sh                #   Start all services
│   └── test.sh               #   Run test suites
│
├── IMPLEMENTATION_PLAN.md      # 48-hour build plan with architecture
├── PRD.MD                      # Product Requirements Document
└── ProblemStatement.md         # Orion Astrathon competition brief
```

---

## Visibility Score Algorithm

The core visibility score combines three weighted factors:

```
Score = 0.5 × Aurora + 0.3 × Darkness + 0.2 × Sky Clarity
```

| Factor | Weight | Components |
|--------|--------|-----------|
| **Aurora** | 50% | OVATION interpolated probability at location |
| **Darkness** | 30% | Average of: Bortle score, moon interference, solar terminator |
| **Sky Clarity** | 20% | Inverse of effective cloud cover (60% low + 30% mid + 10% high clouds) |

**Interpretation:**
| Score Range | Label |
|-------------|-------|
| 80–100 | Excellent — Go now! |
| 60–79 | Good — Favorable conditions |
| 40–59 | Moderate — Possible with patience |
| 0–39 | Poor — Unlikely to see aurora |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/solar-wind/current` | Latest solar wind reading (Bz, speed, density) |
| `GET` | `/api/solar-wind/history?hours=6` | Solar wind time series |
| `GET` | `/api/solar-wind/conditions` | Processed conditions summary |
| `GET` | `/api/aurora/map?min_aurora=5` | OVATION grid as GeoJSON |
| `GET` | `/api/aurora/probability?lat=&lon=` | Aurora value at location |
| `GET` | `/api/aurora/oval?threshold=10` | Auroral oval boundary points |
| `GET` | `/api/aurora/kp` | Current + historical Kp index |
| `GET` | `/api/visibility/score?lat=&lon=` | Full visibility score breakdown |
| `GET` | `/api/visibility/substorm` | Substorm early warning status |
| `GET` | `/api/visibility/photography?kp=&aurora_value=` | Camera settings recommendation |
| `GET` | `/api/visibility/optimal-spots?lat=&lon=` | Best viewing spots nearby |
| `GET` | `/api/weather/?lat=&lon=` | Weather + viewing conditions |
| `GET` | `/api/weather/clouds/forecast?lat=&lon=` | Hourly cloud forecast |
| `GET` | `/api/weather/darkness?lat=&lon=` | Composite darkness score |
| `POST` | `/api/alerts/subscribe` | Subscribe to visibility alerts |
| `DELETE` | `/api/alerts/unsubscribe/{id}` | Remove alert subscription |
| `GET` | `/api/alerts/check` | Evaluate triggered alerts |
| `GET` | `/api/alerts/noaa` | NOAA geomagnetic alerts |
| `POST` | `/api/sightings/` | Submit aurora sighting |
| `GET` | `/api/sightings/?limit=50` | Recent sightings |
| `WS` | `/ws/live` | Real-time solar wind + alert stream |

Full interactive docs available at `http://localhost:8000/docs` when the backend is running.

---

## Scoring Rubric Alignment

| Category | Implementation |
|----------|---------------|
| **Technical Depth** (20) | Live pipeline with 4 concurrent polling loops, DSCOVR→ACE failover, schema validation, gap detection, exponential backoff retry |
| **Visualization** (20) | OVATION heatmap + circle layers, 8-stop aurora color ramp, auroral oval boundary, user location marker, click-to-inspect, auto-refresh |
| **Score Algorithm** (20) | Weighted composite with justified weights, full breakdown (Bortle, moon, terminator, cloud layers), interpretation labels |
| **UX & Usability** (20) | Dark-first design, mobile responsive sidebar, WebSocket real-time updates, skeleton loading, GPS auto-detect |
| **Innovation** (20) | 4 stretch features: GPS routing, substorm detection, community sightings, photography advisor |

---

## Team

Built for the **Orion Astrathon** hackathon — IIT Mandi

---

## License

This project is part of the Orion Astrathon hackathon submission.
