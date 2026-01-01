from abc import ABC, abstractmethod
from typing import List, Tuple, Dict, Any
import time
import networkx as nx


class SearchAlgorithm(ABC):
    """Base class for all search algorithms"""

    def __init__(self, graph: nx.Graph):
        self.graph = graph
        self.nodes_explored = 0
        self.execution_time = 0.0

    @abstractmethod
    def search(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        Search for a path from start to goal.
        Returns: (path, total_distance)
        """
        pass

    def get_performance_metrics(self) -> Dict[str, Any]:
        """Return performance metrics for the search"""
        return {
            "nodes_explored": self.nodes_explored,
            "execution_time": self.execution_time,
        }

    def execute(self, start: str, goal: str) -> Dict[str, Any]:
        """Execute the search and return results with metrics"""
        self.nodes_explored = 0
        start_time = time.time()

        try:
            path, distance = self.search(start, goal)
            self.execution_time = time.time() - start_time

            return {
                "algorithm": self.__class__.__name__,
                "path": path,
                "total_distance": distance,
                "nodes_explored": self.nodes_explored,
                "execution_time": self.execution_time,
                "success": True,
                "error": None
            }
        except Exception as e:
            self.execution_time = time.time() - start_time
            return {
                "algorithm": self.__class__.__name__,
                "path": [],
                "total_distance": 0,
                "nodes_explored": self.nodes_explored,
                "execution_time": self.execution_time,
                "success": False,
                "error": str(e)
            }
