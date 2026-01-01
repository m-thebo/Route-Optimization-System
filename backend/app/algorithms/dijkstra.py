from typing import List, Tuple
import heapq
from .base import SearchAlgorithm


class DijkstraAlgorithm(SearchAlgorithm):
    """Dijkstra's Algorithm using heap-based priority queue"""

    def search(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        Dijkstra's algorithm finds shortest path using a min-heap.
        More efficient than UCS for dense graphs.
        """
        # Priority queue: (cost, state, path)
        heap = [(0, start, [start])]
        visited = set()

        while heap:
            cost, state, path = heapq.heappop(heap)

            if state in visited:
                continue

            visited.add(state)
            self.nodes_explored += 1

            if state == goal:
                return path, cost

            for neighbor in self.graph[state]:
                if neighbor not in visited:
                    new_cost = cost + self.graph[state][neighbor]["distance"]
                    heapq.heappush(heap, (new_cost, neighbor, path + [neighbor]))

        raise Exception(f"No path found from {start} to {goal}")
