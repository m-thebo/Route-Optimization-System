from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .schemas import (
    RouteRequest,
    RouteResponse,
    CompareRequest,
    CompareResponse,
    CityInfo,
    GraphStats,
    SearchHistoryItem,
    HealthResponse
)
from ..core.database import get_db
from ..services import graph_service, route_service

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    graph = graph_service.get_graph()
    return {
        "status": "healthy",
        "version": "1.0.0",
        "graph_loaded": graph is not None,
        "total_cities": graph.number_of_nodes() if graph else 0
    }


@router.get("/cities", response_model=List[str])
async def get_cities():
    """Get list of all available cities"""
    cities = graph_service.get_cities()
    if not cities:
        raise HTTPException(status_code=503, detail="Graph not loaded")
    return cities


@router.get("/cities/{city_name}", response_model=CityInfo)
async def get_city_info(city_name: str):
    """Get detailed information about a specific city"""
    info = graph_service.get_city_info(city_name)
    if info is None:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    return info


@router.get("/graph/stats", response_model=GraphStats)
async def get_graph_stats():
    """Get statistics about the graph"""
    stats = graph_service.get_graph_stats()
    if not stats:
        raise HTTPException(status_code=503, detail="Graph not loaded")
    return stats


@router.post("/route/find", response_model=RouteResponse)
async def find_route(request: RouteRequest, db: Session = Depends(get_db)):
    """Find route between two cities using specified algorithm"""
    try:
        result = route_service.find_route(
            start=request.start,
            goal=request.goal,
            algorithm=request.algorithm,
            db=db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/route/compare", response_model=CompareResponse)
async def compare_algorithms(request: CompareRequest, db: Session = Depends(get_db)):
    """Compare multiple algorithms for the same route"""
    try:
        result = route_service.compare_algorithms(
            start=request.start,
            goal=request.goal,
            algorithms=request.algorithms,
            db=db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=List[SearchHistoryItem])
async def get_search_history(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, le=1000),
    algorithm: Optional[str] = None
):
    """Get search history"""
    try:
        history = route_service.get_search_history(
            db=db,
            limit=limit,
            algorithm=algorithm
        )
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/algorithms", response_model=List[str])
async def get_available_algorithms():
    """Get list of available algorithms"""
    from ..algorithms import ALGORITHMS
    return list(ALGORITHMS.keys())
