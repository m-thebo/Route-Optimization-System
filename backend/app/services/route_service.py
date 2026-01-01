from typing import List, Dict, Any
from sqlalchemy.orm import Session
from ..algorithms import ALGORITHMS
from ..models import SearchHistory
from .graph_service import graph_service


class RouteService:
    """Service for route optimization and search"""

    def find_route(
        self,
        start: str,
        goal: str,
        algorithm: str = "astar",
        db: Session = None
    ) -> Dict[str, Any]:
        """
        Find route using specified algorithm.

        Args:
            start: Starting city name
            goal: Destination city name
            algorithm: Algorithm to use (bfs, dfs, ucs, astar, dijkstra, bidirectional)
            db: Database session (optional, for storing history)

        Returns:
            Dictionary with path, distance, and performance metrics
        """
        # Validate inputs
        graph = graph_service.get_graph()
        if graph is None:
            raise ValueError("Graph not initialized")

        if start not in graph:
            raise ValueError(f"Start city '{start}' not found in graph")

        if goal not in graph:
            raise ValueError(f"Goal city '{goal}' not found in graph")

        # Get algorithm class
        algorithm_lower = algorithm.lower()
        if algorithm_lower not in ALGORITHMS:
            raise ValueError(f"Unknown algorithm: {algorithm}. Available: {list(ALGORITHMS.keys())}")

        # Execute search
        algo_class = ALGORITHMS[algorithm_lower]
        algo_instance = algo_class(graph)
        result = algo_instance.execute(start, goal)

        # Store in database if session provided
        if db and result['success']:
            history = SearchHistory(
                start_city=start,
                goal_city=goal,
                algorithm=algorithm_lower,
                path=result['path'],
                total_distance=result['total_distance'],
                execution_time=result['execution_time'],
                nodes_explored=result['nodes_explored']
            )
            db.add(history)
            db.commit()

        return result

    def compare_algorithms(
        self,
        start: str,
        goal: str,
        algorithms: List[str] = None,
        db: Session = None
    ) -> Dict[str, Any]:
        """
        Compare multiple algorithms on the same route.

        Args:
            start: Starting city name
            goal: Destination city name
            algorithms: List of algorithm names (default: all)
            db: Database session (optional)

        Returns:
            Dictionary with results from all algorithms
        """
        if algorithms is None:
            algorithms = list(ALGORITHMS.keys())

        results = {}
        for algo in algorithms:
            try:
                result = self.find_route(start, goal, algo, db)
                results[algo] = result
            except Exception as e:
                results[algo] = {
                    "success": False,
                    "error": str(e)
                }

        # Add comparison metrics
        successful = {k: v for k, v in results.items() if v.get('success')}

        if successful:
            best_distance = min(r['total_distance'] for r in successful.values())
            fastest_time = min(r['execution_time'] for r in successful.values())
            least_nodes = min(r['nodes_explored'] for r in successful.values())

            for algo, result in successful.items():
                result['is_optimal_distance'] = result['total_distance'] == best_distance
                result['is_fastest'] = result['execution_time'] == fastest_time
                result['is_most_efficient'] = result['nodes_explored'] == least_nodes

        return {
            'start': start,
            'goal': goal,
            'results': results,
            'summary': {
                'total_algorithms': len(algorithms),
                'successful': len(successful),
                'failed': len(algorithms) - len(successful)
            }
        }

    def get_search_history(
        self,
        db: Session,
        limit: int = 100,
        algorithm: str = None
    ) -> List[Dict[str, Any]]:
        """Get search history from database"""
        query = db.query(SearchHistory)

        if algorithm:
            query = query.filter(SearchHistory.algorithm == algorithm)

        history = query.order_by(SearchHistory.created_at.desc()).limit(limit).all()

        return [
            {
                'id': h.id,
                'start_city': h.start_city,
                'goal_city': h.goal_city,
                'algorithm': h.algorithm,
                'path': h.path,
                'total_distance': h.total_distance,
                'execution_time': h.execution_time,
                'nodes_explored': h.nodes_explored,
                'created_at': h.created_at.isoformat()
            }
            for h in history
        ]


# Singleton instance
route_service = RouteService()
