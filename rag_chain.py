from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_cohere import CohereEmbeddings, ChatCohere
import os

load_dotenv()
cohere_api_key = os.getenv("COHERE_API_KEY")

def get_transcript(url):
    try:
        video_id = url.split("v=")[1]
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])
        return " ".join([entry["text"] for entry in transcript])
    except:
        return ""

def build_chain(transcript):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.create_documents([transcript])

    embeddings = CohereEmbeddings(model="embed-english-v3.0", cohere_api_key=cohere_api_key)
    vector_store = FAISS.from_documents(chunks, embeddings)
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 2})

    prompt = PromptTemplate(
        template="""
You are a helpful assistant.
Answer only from the provided transcript context.
If the context is insufficient, say "I don't know."

Transcript:
{context}

Question: {question}
""",
        input_variables=["context", "question"]
    )

    llm = ChatCohere(cohere_api_key=cohere_api_key)
    parser = StrOutputParser()

    def format_docs(docs):
        return " ".join([doc.page_content for doc in docs])

    chain = RunnableParallel({
        "context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough()
    }) | prompt | llm | parser

    return chain
