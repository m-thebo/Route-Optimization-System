from typing import List, Tuple
import networkx as nx
from .base import SearchAlgorithm


class AStarAlgorithm(SearchAlgorithm):
    """A* Search Algorithm"""

    def heuristic(self, node: str, goal: str) -> float:
        """
        Heuristic function that estimates the cost from node to goal.
        Uses actual shortest path length as heuristic (admissible and consistent).
        """
        try:
            return nx.shortest_path_length(self.graph, node, goal, weight="distance")
        except nx.NetworkXNoPath:
            return float('inf')

    def search(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        A* uses both actual cost and heuristic estimate.
        Guarantees optimal path with admissible heuristic.
        """
        frontier = [(start, [start], 0)]
        visited = set()

        while frontier:
            (state, path, cost) = frontier.pop(0)

            if state in visited:
                continue

            visited.add(state)
            self.nodes_explored += 1

            if state == goal:
                return path, cost

            for neighbor in self.graph[state]:
                if neighbor not in visited:
                    new_cost = cost + self.graph[state][neighbor]["distance"]
                    frontier.append((neighbor, path + [neighbor], new_cost))

            # Sort by f(n) = g(n) + h(n)
            frontier.sort(key=lambda x: x[2] + self.heuristic(x[0], goal))

        raise Exception(f"No path found from {start} to {goal}")
