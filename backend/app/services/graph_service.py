import pandas as pd
import networkx as nx
from typing import Dict, List, Any
from sqlalchemy.orm import Session
from ..models import City, Connection


class GraphService:
    """Service for managing the graph and performing route searches"""

    def __init__(self):
        self.graph: nx.Graph = None

    def load_from_csv(self, connections_file: str, cities_file: str = None) -> nx.Graph:
        """Load graph from CSV files"""
        # Load connections
        df_connections = pd.read_csv(connections_file)
        self.graph = nx.from_pandas_edgelist(
            df_connections,
            source='city1',
            target='city2',
            edge_attr='distance'
        )

        # Load city coordinates if provided
        if cities_file:
            df_cities = pd.read_csv(cities_file)
            city_data = {}
            for _, row in df_cities.iterrows():
                city_data[row['city']] = {
                    'latitude': row['latitude'],
                    'longitude': row['longitude'],
                    'population': row.get('population', 0)
                }

            # Add city data as node attributes
            for city, data in city_data.items():
                if city in self.graph:
                    self.graph.nodes[city].update(data)

        return self.graph

    def load_from_database(self, db: Session) -> nx.Graph:
        """Load graph from database"""
        self.graph = nx.Graph()

        # Load all connections
        connections = db.query(Connection).all()

        for conn in connections:
            self.graph.add_edge(
                conn.from_city.name,
                conn.to_city.name,
                distance=conn.distance
            )

        # Add city attributes
        cities = db.query(City).all()
        for city in cities:
            if city.name in self.graph:
                self.graph.nodes[city.name].update({
                    'latitude': city.latitude,
                    'longitude': city.longitude,
                    'population': city.population
                })

        return self.graph

    def get_graph(self) -> nx.Graph:
        """Get the current graph"""
        return self.graph

    def get_cities(self) -> List[str]:
        """Get list of all cities"""
        if self.graph is None:
            return []
        return sorted(list(self.graph.nodes()))

    def get_city_info(self, city: str) -> Dict[str, Any]:
        """Get information about a specific city"""
        if self.graph is None or city not in self.graph:
            return None

        node_data = self.graph.nodes[city]
        neighbors = list(self.graph[city].keys())

        return {
            'name': city,
            'latitude': node_data.get('latitude'),
            'longitude': node_data.get('longitude'),
            'population': node_data.get('population'),
            'connections': neighbors,
            'connection_count': len(neighbors)
        }

    def get_graph_stats(self) -> Dict[str, Any]:
        """Get statistics about the graph"""
        if self.graph is None:
            return {}

        return {
            'total_cities': self.graph.number_of_nodes(),
            'total_connections': self.graph.number_of_edges(),
            'average_connections': sum(dict(self.graph.degree()).values()) / self.graph.number_of_nodes(),
            'is_connected': nx.is_connected(self.graph)
        }


# Singleton instance
graph_service = GraphService()
