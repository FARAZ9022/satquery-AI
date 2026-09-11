"""
Data Models & Schemas
Pydantic models for request/response validation
Member 2 (Image Processing) aur Member 1 (AI) ke data structures
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ================== IMAGE ANALYSIS SCHEMAS ==================

class ImageAnalysisRequest(BaseModel):
    """Frontend se image analysis request"""
    image_path: str = Field(..., description="Image file path or URL")
    location: str = Field(..., description="Geographic location (e.g., Punjab, Delhi)")
    user_question: Optional[str] = Field(None, description="User ka specific question")
    
    class Config:
        example = {
            "image_path": "/uploads/farm_image.jpg",
            "location": "Punjab",
            "user_question": "Is this agricultural land?"
        }


class AnalysisResult(BaseModel):
    """AI Model ka output"""
    analysis_type: str = Field(..., description="Farming/Urban/Vegetation/Water/Desert/Unknown")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    description: str = Field(..., description="Detailed analysis")
    area_detected: str = Field(..., description="Area type detected")
    recommendation: Optional[str] = Field(None, description="Farmer/User ke liye suggestion")
    
    class Config:
        example = {
            "analysis_type": "farming",
            "confidence": 0.95,
            "description": "High-quality agricultural land with crop patterns",
            "area_detected": "180 hectares",
            "recommendation": "Ideal for wheat or rice cultivation"
        }


class ImageProcessingResult(BaseModel):
    """Member 2 ka image processing output"""
    highlighted_image_path: str = Field(..., description="Processed image location")
    coordinates: Optional[List[tuple]] = Field(None, description="Highlighted area coordinates")
    overlay_type: str = Field(..., description="Type of overlay (boundary, heat-map, contour)")
    
    class Config:
        example = {
            "highlighted_image_path": "/results/farm_image_highlighted.jpg",
            "overlay_type": "boundary"
        }


class CompleteAnalysisResponse(BaseModel):
    """Complete response - AI + Image Processing"""
    request_id: str = Field(..., description="Unique request ID")
    image_path: str
    location: str
    timestamp: datetime
    analysis_result: AnalysisResult
    processing_result: ImageProcessingResult
    total_processing_time: float = Field(..., description="Time in seconds")
    status: str = Field(default="success", description="success/error/pending")
    
    class Config:
        example = {
            "request_id": "req_12345",
            "image_path": "/uploads/farm.jpg",
            "location": "Punjab",
            "timestamp": "2024-08-31T10:30:00",
            "status": "success"
        }


# ================== CHAT SCHEMAS ==================

class ChatMessage(BaseModel):
    """Ek chat message"""
    role: str = Field(..., description="user/assistant/system")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = None
    image_context: Optional[str] = Field(None, description="Related image ID")
    
    class Config:
        example = {
            "role": "user",
            "content": "What crops can I grow here?",
            "image_context": "req_12345"
        }


class ChatRequest(BaseModel):
    """Chat endpoint ko request"""
    message: str = Field(..., description="User ka question/message")
    image_id: Optional[str] = Field(None, description="Image ID agar context chahiye")
    session_id: Optional[str] = Field(None, description="Chat session ID")
    
    class Config:
        example = {
            "message": "This is farming land. What should I grow?",
            "image_id": "req_12345"
        }


class ChatResponse(BaseModel):
    """Chat endpoint ka response"""
    response: str = Field(..., description="AI/Bot ka answer")
    confidence: Optional[float] = Field(None, description="Answer confidence")
    related_image_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        example = {
            "response": "Based on the farming area detected, you can grow wheat, rice, or sugarcane.",
            "confidence": 0.92,
            "timestamp": "2024-08-31T10:35:00"
        }


class ChatHistory(BaseModel):
    """Chat session ka pura history"""
    session_id: str
    messages: List[ChatMessage]
    image_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# ================== ERROR SCHEMAS ==================

class ErrorResponse(BaseModel):
    """Error response format"""
    error: str = Field(..., description="Error message")
    status: str = Field(default="error", description="Status")
    details: Optional[str] = Field(None, description="Additional details")
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        example = {
            "error": "Invalid image format",
            "status": "error",
            "details": "Only JPG, PNG, TIFF allowed"
        }


# ================== HEALTH CHECK ==================

class HealthCheckResponse(BaseModel):
    """Server health status"""
    status: str
    version: str
    timestamp: datetime = Field(default_factory=datetime.now)
    ai_model_status: str = Field(default="ok", description="AI model available?")
    database_status: str = Field(default="ok", description="Database connected?")
    
    class Config:
        example = {
            "status": "✅ Healthy",
            "version": "1.0.0",
            "ai_model_status": "ok",
            "database_status": "ok"
        }
