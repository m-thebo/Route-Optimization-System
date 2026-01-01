from typing import List, Tuple
from .base import SearchAlgorithm


class DFSAlgorithm(SearchAlgorithm):
    """Depth-First Search Algorithm"""

    def search(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        DFS explores as far as possible along each branch before backtracking.
        Does not guarantee optimal path.
        """
        stack = [(start, [start], 0)]
        visited = {start}

        while stack:
            (state, path, cost) = stack.pop()
            self.nodes_explored += 1

            if state == goal:
                return path, cost

            for neighbor in self.graph[state]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    new_cost = cost + self.graph[state][neighbor]["distance"]
                    stack.append((neighbor, path + [neighbor], new_cost))

        raise Exception(f"No path found from {start} to {goal}")
