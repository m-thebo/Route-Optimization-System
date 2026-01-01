from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from .core.config import settings
from .core.database import init_db
from .api import router
from .services import graph_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print(">> Starting Route Optimization Platform...")

    # Initialize database
    init_db()
    print(">> Database initialized")

    # Load graph from CSV
    base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    connections_file = os.path.join(base_path, "CitiesPk.csv")
    cities_file = os.path.join(base_path, "data", "cities_with_coordinates.csv")

    try:
        graph_service.load_from_csv(connections_file, cities_file)
        stats = graph_service.get_graph_stats()
        print(f">> Graph loaded: {stats['total_cities']} cities, {stats['total_connections']} connections")
    except Exception as e:
        print(f">> Warning: Could not load graph from CSV: {e}")

    yield

    # Shutdown
    print(">> Shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A professional route optimization platform with multiple pathfinding algorithms",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Route Optimization Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health"
    }
