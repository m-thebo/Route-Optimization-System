import pytest
import networkx as nx
from app.algorithms import (
    BFSAlgorithm,
    DFSAlgorithm,
    UCSAlgorithm,
    AStarAlgorithm,
    DijkstraAlgorithm,
    BidirectionalAlgorithm
)


@pytest.fixture
def simple_graph():
    """Create a simple test graph"""
    G = nx.Graph()
    edges = [
        ('A', 'B', 1),
        ('B', 'C', 2),
        ('A', 'C', 4),
        ('C', 'D', 1),
        ('B', 'D', 5)
    ]
    for u, v, w in edges:
        G.add_edge(u, v, distance=w)
    return G


@pytest.fixture
def complex_graph():
    """Create a more complex test graph"""
    G = nx.Graph()
    edges = [
        ('A', 'B', 4),
        ('A', 'C', 2),
        ('B', 'C', 1),
        ('B', 'D', 5),
        ('C', 'D', 8),
        ('C', 'E', 10),
        ('D', 'E', 2),
        ('D', 'F', 6),
        ('E', 'F', 3)
    ]
    for u, v, w in edges:
        G.add_edge(u, v, distance=w)
    return G


class TestBFS:
    def test_finds_path(self, simple_graph):
        algo = BFSAlgorithm(simple_graph)
        path, distance = algo.search('A', 'D')
        assert path is not None
        assert path[0] == 'A'
        assert path[-1] == 'D'

    def test_nodes_explored(self, simple_graph):
        algo = BFSAlgorithm(simple_graph)
        algo.search('A', 'D')
        assert algo.nodes_explored > 0

    def test_no_path_raises_error(self, simple_graph):
        algo = BFSAlgorithm(simple_graph)
        with pytest.raises(Exception):
            algo.search('A', 'Z')


class TestDFS:
    def test_finds_path(self, simple_graph):
        algo = DFSAlgorithm(simple_graph)
        path, distance = algo.search('A', 'D')
        assert path is not None
        assert path[0] == 'A'
        assert path[-1] == 'D'

    def test_nodes_explored(self, simple_graph):
        algo = DFSAlgorithm(simple_graph)
        algo.search('A', 'D')
        assert algo.nodes_explored > 0


class TestUCS:
    def test_finds_optimal_path(self, simple_graph):
        algo = UCSAlgorithm(simple_graph)
        path, distance = algo.search('A', 'D')
        assert path == ['A', 'B', 'C', 'D'] or path == ['A', 'C', 'D']
        assert distance == 4  # A->B->C->D = 1+2+1 = 4 or A->C->D = 4+1 = 5

    def test_complex_graph(self, complex_graph):
        algo = UCSAlgorithm(complex_graph)
        path, distance = algo.search('A', 'F')
        assert path is not None
        assert distance > 0


class TestAStar:
    def test_finds_optimal_path(self, simple_graph):
        algo = AStarAlgorithm(simple_graph)
        path, distance = algo.search('A', 'D')
        assert path is not None
        assert distance == 4

    def test_complex_graph(self, complex_graph):
        algo = AStarAlgorithm(complex_graph)
        path, distance = algo.search('A', 'F')
        assert path is not None


class TestDijkstra:
    def test_finds_optimal_path(self, simple_graph):
        algo = DijkstraAlgorithm(simple_graph)
        path, distance = algo.search('A', 'D')
        assert path is not None
        assert distance == 4

    def test_complex_graph(self, complex_graph):
        algo = DijkstraAlgorithm(complex_graph)
        path, distance = algo.search('A', 'F')
        assert path is not None


class TestBidirectional:
    def test_finds_path(self, simple_graph):
        algo = BidirectionalAlgorithm(simple_graph)
        path, distance = algo.search('A', 'D')
        assert path is not None
        assert path[0] == 'A'
        assert path[-1] == 'D'

    def test_same_start_goal(self, simple_graph):
        algo = BidirectionalAlgorithm(simple_graph)
        path, distance = algo.search('A', 'A')
        assert path == ['A']
        assert distance == 0


class TestAlgorithmExecution:
    def test_execute_returns_metrics(self, simple_graph):
        algo = BFSAlgorithm(simple_graph)
        result = algo.execute('A', 'D')

        assert 'algorithm' in result
        assert 'path' in result
        assert 'total_distance' in result
        assert 'nodes_explored' in result
        assert 'execution_time' in result
        assert 'success' in result

        assert result['success'] is True
        assert result['execution_time'] >= 0

    def test_execute_handles_errors(self, simple_graph):
        algo = BFSAlgorithm(simple_graph)
        result = algo.execute('A', 'Z')

        assert result['success'] is False
        assert result['error'] is not None
