from .base import SearchAlgorithm
from .bfs import BFSAlgorithm
from .dfs import DFSAlgorithm
from .ucs import UCSAlgorithm
from .astar import AStarAlgorithm
from .dijkstra import DijkstraAlgorithm
from .bidirectional import BidirectionalAlgorithm

ALGORITHMS = {
    "bfs": BFSAlgorithm,
    "dfs": DFSAlgorithm,
    "ucs": UCSAlgorithm,
    "astar": AStarAlgorithm,
    "dijkstra": DijkstraAlgorithm,
    "bidirectional": BidirectionalAlgorithm,
}

__all__ = [
    "SearchAlgorithm",
    "BFSAlgorithm",
    "DFSAlgorithm",
    "UCSAlgorithm",
    "AStarAlgorithm",
    "DijkstraAlgorithm",
    "BidirectionalAlgorithm",
    "ALGORITHMS",
]
