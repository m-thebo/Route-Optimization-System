from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from datetime import datetime
from ..core.database import Base


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    start_city = Column(String, nullable=False)
    goal_city = Column(String, nullable=False)
    algorithm = Column(String, nullable=False)
    path = Column(JSON, nullable=False)
    total_distance = Column(Float, nullable=False)
    execution_time = Column(Float, nullable=False)
    nodes_explored = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
