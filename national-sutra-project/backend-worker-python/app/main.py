from fastapi import FastAPI
from fastapi.responses import JSONRespomse

app = FastAPI(
    title="全民大寫經 - 後臺運算微服務 (Worker API)",
    description="專責處理 AI 圖像/語音審核與 FFmpeg 影音背景任務",
    version="1.0",
)

@app.get("/health", tags=["System"])
async def health_check():
    """
    系統健康檢查端點。
    供基礎設施 (如 Docker, 或負載平衡器) 探測服務是否正常存活。
    """
    return JSONRespomse(
        content = {
            "status":"ok",
            "service":"backend-worker-python",
            "message": "FastAPI worker is running.",
        }
    )

# 提示：未來您可以將各業務模組的 Router 引入於此
# from app.api import vision, speech, audio_merger
# app.include_router(vision.router, prefix="/api/v1/vision", tags=["AI Vision"])