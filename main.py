from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from rag_chain import build_chain,get_transcript
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="YouTube RAG API",
    description="API for chatting with YouTube video content",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranscriptRequest(BaseModel):
    url: str
    
class QuestionRequest(BaseModel):
    transcript: str
    question: str


@app.post("/get_transcript")
async def load_transcript(request: TranscriptRequest):
    try:
        transcript = get_transcript(request.url)
        if not transcript:
            raise HTTPException(400,"failed to get transcript")
        return {"transcript": transcript}
            
    except Exception as e:
        raise HTTPException(500,str(e))

@app.post("/get_answer")
async def generate_answer(request: QuestionRequest):
    try:
        chain = build_chain(request.transcript)
        answer = chain.invoke(request.question)
        return {"answer":answer}
    except Exception as e:
        raise HTTPException(500,str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)