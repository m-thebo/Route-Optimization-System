from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Route Optimization Platform"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./route_optimization.db"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
