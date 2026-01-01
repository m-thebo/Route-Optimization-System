from sqlalchemy import Column, Integer, String, Float, Table, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    population = Column(Integer, nullable=True)

    # Relationships
    connections_from = relationship("Connection", foreign_keys="Connection.from_city_id", back_populates="from_city")
    connections_to = relationship("Connection", foreign_keys="Connection.to_city_id", back_populates="to_city")


class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    from_city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    to_city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    distance = Column(Float, nullable=False)

    # Relationships
    from_city = relationship("City", foreign_keys=[from_city_id], back_populates="connections_from")
    to_city = relationship("City", foreign_keys=[to_city_id], back_populates="connections_to")
