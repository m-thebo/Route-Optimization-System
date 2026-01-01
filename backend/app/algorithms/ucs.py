from typing import List, Tuple
from .base import SearchAlgorithm


class UCSAlgorithm(SearchAlgorithm):
    """Uniform Cost Search Algorithm"""

    def search(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        UCS always expands the node with lowest cumulative cost.
        Guarantees optimal path when all edge costs are non-negative.
        """
        queue = [(start, [start], 0)]
        visited = set()

        while queue:
            (state, path, cost) = queue.pop(0)

            if state in visited:
                continue

            visited.add(state)
            self.nodes_explored += 1

            if state == goal:
                return path, cost

            for neighbor in self.graph[state]:
                if neighbor not in visited:
                    new_cost = cost + self.graph[state][neighbor]["distance"]
                    queue.append((neighbor, path + [neighbor], new_cost))

            # Sort by cost (priority queue behavior)
            queue.sort(key=lambda x: x[2])

        raise Exception(f"No path found from {start} to {goal}")
