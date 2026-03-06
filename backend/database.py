"""Database connection utilities for MongoDB."""

import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "smart_vision")

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    """Initialize MongoDB client and database handles."""
    global client, database
    client = AsyncIOMotorClient(MONGODB_URI)
    database = client[MONGODB_DB]


async def close_mongo_connection() -> None:
    """Close MongoDB connection cleanly."""
    global client
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    """Return active database instance."""
    if database is None:
        raise RuntimeError("Database connection not initialized.")
    return database
