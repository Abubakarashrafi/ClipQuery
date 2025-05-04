# 🎥 ClipQuery — Ask Questions from YouTube Videos

**ClipQuery** is a Retrieval-Augmented Generation (RAG) application that lets you ask questions about the content of any YouTube video. It combines the power of **LangChain** with a simple **FastAPI** backend and a responsive **HTML/CSS/JavaScript** frontend.

---

## 🚀 Features

- 🔍 Extracts and processes transcripts from YouTube videos  
- 🤖 Uses LangChain for answering questions from video content  
- ⚡ FastAPI backend for handling API requests  
- 💻 Minimalistic and responsive frontend  
- 📜 Supports long-form videos with chunked retrieval

---

## 🛠️ Tech Stack

- **LangChain** – for RAG pipeline  
- **FastAPI** – backend server  
- **HTML/CSS/JavaScript** – frontend interface  
- **YouTube Transcript API** – for transcript extraction  
- **OpenAI or other LLMs** – for generating answers  

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Abubakarashrafi/clipquery.git
cd clipquery
```

## 2. Set up Python Environment 
```bash
python -m venv venv
venv\Scripts\activate  
pip install -r requirements.txt
```

## 3. Set environment variables
- Create a .env file and add your keys:
```bash
OPENAI_API_KEY=your_key_here
```

## 4. ▶️ Run the App
```bash
uvicorn app.main:app --reload
```

## 5. 🧠 How It Works
- User submits a YouTube URL and a question.
- Backend fetches the transcript of the video.
- Transcript is chunked and indexed using LangChain.
- The question is used to retrieve relevant chunks.
- An answer is generated using an LLM and sent back to the user.


