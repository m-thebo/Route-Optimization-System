from typing import List, Tuple, Set, Dict
from .base import SearchAlgorithm


class BidirectionalAlgorithm(SearchAlgorithm):
    """Bidirectional Search Algorithm"""

    def search(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        Searches from both start and goal simultaneously.
        Can be faster than unidirectional search.
        """
        if start == goal:
            return [start], 0

        # Forward search from start
        forward_queue = [(start, [start], 0)]
        forward_visited = {start: ([], 0)}

        # Backward search from goal
        backward_queue = [(goal, [goal], 0)]
        backward_visited = {goal: ([], 0)}

        while forward_queue and backward_queue:
            # Expand forward
            if forward_queue:
                f_state, f_path, f_cost = forward_queue.pop(0)
                self.nodes_explored += 1

                # Check if paths meet
                if f_state in backward_visited:
                    b_path, b_cost = backward_visited[f_state]
                    total_path = f_path + list(reversed(b_path[:-1]))
                    return total_path, f_cost + b_cost

                for neighbor in self.graph[f_state]:
                    if neighbor not in forward_visited:
                        new_cost = f_cost + self.graph[f_state][neighbor]["distance"]
                        new_path = f_path + [neighbor]
                        forward_queue.append((neighbor, new_path, new_cost))
                        forward_visited[neighbor] = (new_path, new_cost)

            # Expand backward
            if backward_queue:
                b_state, b_path, b_cost = backward_queue.pop(0)
                self.nodes_explored += 1

                # Check if paths meet
                if b_state in forward_visited:
                    f_path, f_cost = forward_visited[b_state]
                    total_path = f_path + list(reversed(b_path[:-1]))
                    return total_path, f_cost + b_cost

                for neighbor in self.graph[b_state]:
                    if neighbor not in backward_visited:
                        new_cost = b_cost + self.graph[b_state][neighbor]["distance"]
                        new_path = b_path + [neighbor]
                        backward_queue.append((neighbor, new_path, new_cost))
                        backward_visited[neighbor] = (new_path, new_cost)

        raise Exception(f"No path found from {start} to {goal}")
