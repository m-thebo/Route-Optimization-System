from typing import List, Tuple
from .base import SearchAlgorithm


class BFSAlgorithm(SearchAlgorithm):
    """Breadth-First Search Algorithm"""

    def search(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        BFS explores all neighbors at the current depth before moving deeper.
        Does not guarantee shortest path by distance, but finds path with fewest nodes.
        """
        queue = [(start, [start], 0)]
        visited = {start}

        while queue:
            (state, path, cost) = queue.pop(0)
            self.nodes_explored += 1

            if state == goal:
                return path, cost

            for neighbor in self.graph[state]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    new_cost = cost + self.graph[state][neighbor]["distance"]
                    queue.append((neighbor, path + [neighbor], new_cost))

        raise Exception(f"No path found from {start} to {goal}")
