"""
Configuration File
Central place for all constants and settings
"""

import os
from typing import List

# ================== APP CONFIGURATION ==================

APP_NAME = "TerraMind AI"
APP_VERSION = "1.0.0"
DEBUG_MODE = True

# ================== CORS SETTINGS ==================

ALLOWED_ORIGINS: List[str] = [
    "http://localhost:3000",      # Frontend (React/Vue)
    "http://localhost:8080",      # Frontend (alternative)
    "http://127.0.0.1:3000",      # localhost alternative
    "http://127.0.0.1:8080",
    "*"                            # Development only - remove in production
]

# ================== DATABASE CONFIG ==================

DATABASE_URL = "sqlite:///./terraming.db"  # SQLite (simple)
# DATABASE_URL = "postgresql://user:password@localhost/terraming"  # PostgreSQL (production)

# ================== AI MODEL CONFIG ==================

MODEL_PATH = "./models/satellite_model.h5"  # Member 1 ka AI model
MODEL_CONFIDENCE_THRESHOLD = 0.70  # 70% se zyada confidence chahiye

# ================== FILE UPLOAD CONFIG ==================

UPLOAD_FOLDER = "./uploads"
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "tiff", "tif"}

# ================== ANALYSIS CONFIG ==================

ANALYSIS_TYPES = {
    "farming": "Agricultural/Farming Area",
    "urban": "Urban/City Area",
    "vegetation": "Forest/Vegetation Area",
    "water": "Water Body",
    "desert": "Desert/Barren Land",
    "unknown": "Unknown"
}

# ================== CHAT CONFIG ==================

CHAT_HISTORY_LIMIT = 50  # Kitne purane messages store karengo
DEFAULT_CHAT_TIMEOUT = 30  # 30 seconds

# ================== LOGGING CONFIG ==================

LOG_FILE = "./logs/terraming.log"
LOG_LEVEL = "INFO"

# ================== API KEYS (Backend to AI Model) ==================

AI_MODEL_API_KEY = os.getenv("AI_MODEL_API_KEY", "test-key-12345")
IMAGE_PROCESSING_SERVICE_KEY = os.getenv("IMG_PROC_KEY", "test-key-67890")

# ================== SECURITY ==================

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

print(f"✅ Configuration loaded - {APP_NAME} v{APP_VERSION}")
