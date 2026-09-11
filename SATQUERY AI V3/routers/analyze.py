"""
Image Analysis Router
Member 1 (AI Model) aur Member 2 (Image Processing) ke saath communicate karte hain
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import logging
import uuid
from datetime import datetime

from models.schemas import (
    ImageAnalysisRequest, 
    CompleteAnalysisResponse, 
    AnalysisResult,
    ImageProcessingResult,
    ErrorResponse
)
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, ANALYSIS_TYPES

# Logger setup
logger = logging.getLogger(__name__)

# Router define karo
router = APIRouter()

# ================== HELPER FUNCTIONS ==================

def validate_image_file(filename: str) -> bool:
    """Check karega file valid hai ya nahi"""
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def call_ai_model(image_path: str, location: str) -> dict:
    logger.info(f"Calling AI Model for image: {image_path}")
    
    # Dynamic Sector Analysis breakdown
    return {
        "analysis_type": "urban",
        "confidence": 0.94,
        "description": "High-density urban development detected with buildings, roads, and infrastructure.",
        "area_detected": "450 hectares",
        "sectors": {
            "vegetation": 15,
            "urban": 65,
            "water": 10,
            "barren": 10
        },
        "recommendation": "Urban zone with low green cover. Tree canopy expansion recommended."
    }
    
    # Mock AI response (Member 1 replace karega apne AI se)
    return {
        "analysis_type": "farming",
        "confidence": 0.92,
        "description": "Agricultural area detected with organized crop patterns",
        "area_detected": "250 hectares",
        "recommendation": "Suitable for wheat cultivation in this season"
    }


def call_image_processing(image_path: str, analysis_type: str) -> dict:
    """
    Member 2 (Image Processing) ko call karna
    Highlight aur processing karega
    """
    logger.info(f"Calling Image Processing for: {image_path}")
    
    # Mock image processing response (Member 2 replace karega)
    return {
        "highlighted_image_path": f"/results/{image_path.split('/')[-1]}",
        "coordinates": [(10, 10), (100, 100), (50, 150)],
        "overlay_type": "boundary"
    }


# ================== ANALYZE ENDPOINTS ==================

@router.post("/", response_model=CompleteAnalysisResponse)
async def analyze_image(request: ImageAnalysisRequest):
    """
    🖼️ Main endpoint - Image analysis karne ke liye
    
    Flow:
    1. Image receive karo (Member 5 frontend se)
    2. AI Model ko bhejo (Member 1)
    3. Image processing karo (Member 2)
    4. Result daldo Frontend ko
    """
    try:
        # Unique request ID banao
        request_id = f"req_{uuid.uuid4().hex[:8]}"
        logger.info(f"[{request_id}] Analyzing image: {request.image_path}")
        
        # Step 1: AI Model call karo
        ai_result = call_ai_model(request.image_path, request.location)
        
        # Step 2: Image Processing call karo
        processing_result = call_image_processing(request.image_path, ai_result["analysis_type"])
        
        # Step 3: Response format karo
        response = CompleteAnalysisResponse(
            request_id=request_id,
            image_path=request.image_path,
            location=request.location,
            timestamp=datetime.now(),
            analysis_result=AnalysisResult(**ai_result),
            processing_result=ImageProcessingResult(**processing_result),
            total_processing_time=2.45,  # Estimate
            status="success"
        )
        
        logger.info(f"[{request_id}] Analysis complete - Type: {ai_result['analysis_type']}")
        return response
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload_and_analyze(file: UploadFile = File(...)):
    """
    📤 Image upload aur analysis
    Frontend se image upload karega, analyse karega
    """
    try:
        # File validation
        if not validate_image_file(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file format. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # File save karo
        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = f"{UPLOAD_FOLDER}/{filename}"
        
        logger.info(f"Saving file: {filepath}")
        
        # Mock save (actual file save karna padega)
        # with open(filepath, "wb") as f:
        #     contents = await file.read()
        #     f.write(contents)
        
        # AI analysis karo
        ai_result = call_ai_model(filepath, "Unknown")
        
        return {
            "message": "Image uploaded and analyzed",
            "filename": filename,
            "filepath": filepath,
            "analysis": ai_result,
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/result/{request_id}")
async def get_analysis_result(request_id: str):
    """
    📊 Pichle analysis ka result dobara retrieve karo
    request_id se pata chal jaata hai konsa analysis tha
    """
    # Mock database query
    if not request_id.startswith("req_"):
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {
        "request_id": request_id,
        "status": "completed",
        "analysis_type": "farming",
        "confidence": 0.94,
        "retrieved_at": datetime.now()
    }


@router.get("/history")
async def get_analysis_history(limit: int = 10):
    """
    📜 Pichle analyses ka history
    """
    return {
        "total_analyses": 42,
        "recent": [
            {
                "request_id": f"req_{i}",
                "analysis_type": ANALYSIS_TYPES.get("farming"),
                "timestamp": datetime.now(),
                "confidence": 0.92
            }
            for i in range(limit)
        ]
    }


@router.get("/types")
async def get_analysis_types():
    """
    📋 Kaunse analysis types available hain
    """
    return {
        "available_types": ANALYSIS_TYPES,
        "total_types": len(ANALYSIS_TYPES)
    }


# ================== STATISTICS ==================

@router.get("/stats")
async def get_analysis_stats():
    """
    📈 Backend ka statistics - kitne analyses complete hue
    """
    return {
        "total_analyses_processed": 156,
        "average_confidence": 0.91,
        "most_common_type": "farming",
        "uptime_hours": 48,
        "active_requests": 3
    }
