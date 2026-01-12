from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.groq_service import groq_service

router = APIRouter(prefix="/voice", tags=["Voice"])

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    print(f"Recebendo áudio para transcrição: {file.filename}")
    try:
        content = await file.read()
        # Pass filename to help Whisper with format detection if needed
        result = groq_service.transcribe_audio(content, filename=file.filename)
        return result
    except Exception as e:
        print(f"Erro na transcrição: {e}")
        raise HTTPException(status_code=500, detail=str(e))
