import pandas as pd
from sqlalchemy.orm import Session
from ..models import City, Connection
from ..core.database import SessionLocal, init_db
import os


def load_cities_from_csv(db: Session, csv_file: str):
    """Load cities from CSV into database"""
    df = pd.read_csv(csv_file)

    cities_added = 0
    for _, row in df.iterrows():
        # Check if city already exists
        existing = db.query(City).filter(City.name == row['city']).first()
        if not existing:
            city = City(
                name=row['city'],
                latitude=row['latitude'],
                longitude=row['longitude'],
                population=row.get('population', 0)
            )
            db.add(city)
            cities_added += 1

    db.commit()
    print(f"✓ Added {cities_added} cities to database")
    return cities_added


def load_connections_from_csv(db: Session, csv_file: str):
    """Load connections from CSV into database"""
    df = pd.read_csv(csv_file)

    # Get all cities from database
    cities = {city.name: city.id for city in db.query(City).all()}

    connections_added = 0
    for _, row in df.iterrows():
        city1 = row['city1']
        city2 = row['city2']
        distance = row['distance']

        # Ensure both cities exist
        if city1 not in cities or city2 not in cities:
            print(f"⚠ Warning: Skipping connection {city1}-{city2}, city not found")
            continue

        # Check if connection already exists
        existing = db.query(Connection).filter(
            ((Connection.from_city_id == cities[city1]) & (Connection.to_city_id == cities[city2])) |
            ((Connection.from_city_id == cities[city2]) & (Connection.to_city_id == cities[city1]))
        ).first()

        if not existing:
            # Add bidirectional connections
            conn1 = Connection(
                from_city_id=cities[city1],
                to_city_id=cities[city2],
                distance=distance
            )
            conn2 = Connection(
                from_city_id=cities[city2],
                to_city_id=cities[city1],
                distance=distance
            )
            db.add(conn1)
            db.add(conn2)
            connections_added += 2

    db.commit()
    print(f"✓ Added {connections_added} connections to database")
    return connections_added


def initialize_database(cities_file: str = None, connections_file: str = None):
    """Initialize database with data from CSV files"""
    print("🔄 Initializing database...")

    # Initialize tables
    init_db()
    print("✓ Database tables created")

    # Get database session
    db = SessionLocal()

    try:
        # Default file paths
        if cities_file is None:
            base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            cities_file = os.path.join(base_path, "data", "cities_with_coordinates.csv")

        if connections_file is None:
            base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            connections_file = os.path.join(base_path, "CitiesPk.csv")

        # Load data
        if os.path.exists(cities_file):
            load_cities_from_csv(db, cities_file)
        else:
            print(f"⚠ Warning: Cities file not found: {cities_file}")

        if os.path.exists(connections_file):
            load_connections_from_csv(db, connections_file)
        else:
            print(f"⚠ Warning: Connections file not found: {connections_file}")

        print("✅ Database initialization complete!")

    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    initialize_database()
