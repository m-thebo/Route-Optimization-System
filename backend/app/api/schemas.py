from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class RouteRequest(BaseModel):
    start: str = Field(..., description="Starting city name")
    goal: str = Field(..., description="Destination city name")
    algorithm: str = Field(default="astar", description="Algorithm to use (bfs, dfs, ucs, astar, dijkstra, bidirectional)")


class CompareRequest(BaseModel):
    start: str = Field(..., description="Starting city name")
    goal: str = Field(..., description="Destination city name")
    algorithms: Optional[List[str]] = Field(default=None, description="List of algorithms to compare")


class RouteResponse(BaseModel):
    algorithm: str
    path: List[str]
    total_distance: float
    nodes_explored: int
    execution_time: float
    success: bool
    error: Optional[str] = None
    is_optimal_distance: Optional[bool] = None
    is_fastest: Optional[bool] = None
    is_most_efficient: Optional[bool] = None


class CompareResponse(BaseModel):
    start: str
    goal: str
    results: Dict[str, RouteResponse]
    summary: Dict[str, int]


class CityInfo(BaseModel):
    name: str
    latitude: Optional[float]
    longitude: Optional[float]
    population: Optional[int]
    connections: List[str]
    connection_count: int


class GraphStats(BaseModel):
    total_cities: int
    total_connections: int
    average_connections: float
    is_connected: bool


class SearchHistoryItem(BaseModel):
    id: int
    start_city: str
    goal_city: str
    algorithm: str
    path: List[str]
    total_distance: float
    execution_time: float
    nodes_explored: int
    created_at: str


class HealthResponse(BaseModel):
    status: str
    version: str
    graph_loaded: bool
    total_cities: int
