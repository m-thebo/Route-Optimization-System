# 🚚 Pharmaceutical Distribution & Route Optimization Platform

> **A full-stack web application designed for optimizing pharmaceutical delivery routes across Pakistan's distribution network using advanced pathfinding algorithms.
> NOTE: It currently has the data for only 61 cities but can be scaled.**

## Project Overview

This project simulates a **real-world pharmaceutical logistics system** ("New Bhittai Logistics"), helping distribution companies optimize their delivery routes across 61 cities in Pakistan. The platform compares 6 different route optimization algorithms in real-time, providing detailed performance analytics to help logistics managers make data-driven decisions for their delivery fleet.

### Why This Project?

Pharmaceutical distribution requires careful route planning to ensure timely delivery of medications to pharmacies and healthcare centers. This platform addresses that need by:

- **Comparing Multiple Algorithms**: See which pathfinding algorithm (BFS, DFS, UCS, A*, Dijkstra, or Bidirectional Search) finds the most efficient route
- **Real-Time Visualization**: Interactive maps showing actual delivery routes with custom truck and warehouse icons
- **Performance Analytics**: Detailed metrics on distance, time, and efficiency for each algorithm
- **Business Context**: Designed with pharmaceutical distribution in mind, featuring delivery fleet management UI

### Key Highlights

- ✅ **Full-Stack Development**: FastAPI backend + React frontend
- ✅ **6 Pathfinding Algorithms**: From basic BFS to advanced A* with heuristics
- ✅ **Interactive Maps**: Real geographic coordinates with Leaflet.js
- ✅ **Performance Comparison**: Side-by-side algorithm analysis with charts
- ✅ **Database Integration**: SQLite/PostgreSQL for storing route history
- ✅ **Professional UI/UX**: Material-UI with pharmaceutical industry theme
- ✅ **Docker Ready**: Containerized for easy deployment
- ✅ **RESTful API**: Well-documented with Swagger/OpenAPI

### What It Looks Like

The platform features:
- **Dashboard**: 4 metric cards showing distribution centers, system uptime, algorithms, and real-time status
- **Route Planner**: Select origin/destination distribution centers and optimization algorithm
- **Fleet Status**: Shows active delivery trucks, planned routes, and network coverage
- **Interactive Maps**:
  - 🚚 Green delivery truck icon for origin
  - 🏥 Red warehouse icon for destination
  - Blue markers for intermediate distribution centers
- **Performance Charts**: Bar charts comparing distance and execution time across algorithms
- **Algorithm Comparison**: Side-by-side map views showing different routes

---

## Technical Implementation

### Architecture

A professional, production-ready web application for route optimization using multiple pathfinding algorithms. Built with FastAPI, React, and interactive map visualizations.

```
route-optimization-platform/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── algorithms/     # Search algorithm implementations
│   │   ├── api/            # API routes and schemas
│   │   ├── core/           # Configuration and database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── tests/              # Backend tests
│   └── requirements.txt
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── services/      # API integration
│   └── package.json
├── data/                   # Data files
│   └── cities_with_coordinates.csv
├── CitiesPk.csv           # Connection data
└── docker-compose.yml     # Docker configuration
```

### Features

#### Core Functionality
- **6 Advanced Algorithms**: BFS, DFS, UCS, A*, Dijkstra, Bidirectional Search
- **Real-time Route Visualization**: Interactive maps with Leaflet showing actual routes
- **Performance Analytics**: Detailed metrics comparing algorithm efficiency
- **Search History**: Database-backed storage of all route searches
- **RESTful API**: Well-documented API with Swagger/OpenAPI

#### Professional Features
- **Interactive Maps**: Real geographic coordinates with zoom/pan
- **Performance Metrics**: Execution time, nodes explored, distance comparison
- **Algorithm Comparison**: Side-by-side comparison of all algorithms
- **Responsive Design**: Material-UI components with modern UX
- **Docker Support**: Containerized deployment ready
- **Database Integration**: SQLite/PostgreSQL support
- **CORS Enabled**: Ready for cross-origin requests

---

## Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd route-optimization-platform

# Start the application
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload

# Backend runs on http://localhost:8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start development server
npm start

# Frontend runs on http://localhost:3000
```

---

## Algorithms Implemented

### 1. **Breadth-First Search (BFS)**
- Explores all neighbors at current depth before going deeper
- Guarantees shortest path by number of nodes
- Time: O(V + E), Space: O(V)

### 2. **Depth-First Search (DFS)**
- Explores as deep as possible before backtracking
- May not find optimal path
- Time: O(V + E), Space: O(V)

### 3. **Uniform Cost Search (UCS)**
- Always expands lowest-cost node
- Guarantees optimal path
- Time: O(E log V), Space: O(V)

### 4. **A* Search**
- Uses heuristic to guide search
- Optimal with admissible heuristic
- Time: O(E log V), Space: O(V)

### 5. **Dijkstra's Algorithm**
- Heap-based implementation
- Finds shortest path from source
- Time: O(E log V), Space: O(V)

### 6. **Bidirectional Search**
- Searches from both start and goal
- Can be faster than unidirectional
- Time: O(b^(d/2)), Space: O(b^(d/2))

---

## API Endpoints

### Health & Info
- `GET /` - Root endpoint
- `GET /api/v1/health` - Health check
- `GET /api/v1/algorithms` - List available algorithms

### Cities
- `GET /api/v1/cities` - Get all cities
- `GET /api/v1/cities/{name}` - Get city details
- `GET /api/v1/graph/stats` - Graph statistics

### Routes
- `POST /api/v1/route/find` - Find single route
- `POST /api/v1/route/compare` - Compare all algorithms
- `GET /api/v1/history` - Get search history

### Example API Request

```bash
curl -X POST "http://localhost:8000/api/v1/route/find" \
  -H "Content-Type: application/json" \
  -d '{
    "start": "Karachi",
    "goal": "Islamabad",
    "algorithm": "astar"
  }'
```

---

## Performance Metrics

The platform tracks and displays:
- **Execution Time**: Algorithm runtime in milliseconds
- **Nodes Explored**: Number of nodes visited during search
- **Path Length**: Number of cities in the route
- **Total Distance**: Route distance in kilometers
- **Optimality**: Whether the path is optimal

---

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

![sc1](screenshots/image.png)

## Database Schema

### Cities Table
- id (Primary Key)
- name (Unique)
- latitude, longitude
- population

### Connections Table
- id (Primary Key)
- from_city_id (Foreign Key)
- to_city_id (Foreign Key)
- distance

### Search History Table
- id (Primary Key)
- start_city, goal_city
- algorithm
- path (JSON)
- total_distance
- execution_time
- nodes_explored
- created_at

---

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **NetworkX**: Graph algorithms library
- **Pandas**: Data manipulation
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **Material-UI**: Component library
- **React Leaflet**: Map visualization
- **Recharts**: Chart library
- **Axios**: HTTP client

---

## Configuration

### Backend Environment Variables
```env
DATABASE_URL=sqlite:///./route_optimization.db
ENVIRONMENT=development
LOG_LEVEL=INFO
API_V1_PREFIX=/api/v1
PROJECT_NAME=Route Optimization Platform
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

---

## Deployment

### Docker Deployment
```bash
docker-compose up -d
```

---


## Acknowledgments

- City data and connections based on Pakistan's major urban centers
- Map tiles provided by OpenStreetMap
- Icons and markers created with Leaflet.js and custom SVG

---


