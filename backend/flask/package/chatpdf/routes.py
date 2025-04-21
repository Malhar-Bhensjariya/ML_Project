from flask import Blueprint, request, jsonify
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

chatpdf_bp = Blueprint('pdf_chat', __name__)

def get_pdf_text(pdf_files):
    text = ""
    for pdf in pdf_files:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return text_splitter.split_text(text)

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context. If the answer is not in
    the provided context, say "answer is not available in the context" and do not provide a wrong answer.
    
    Context:
    {context}
    
    Question:
    {question}
    
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)

@chatpdf_bp.route('/process_pdfs', methods=['POST'])
def process_pdfs():
    if 'pdfs' not in request.files:
        return jsonify({"error": "No PDF files provided"}), 400
    
    pdf_files = request.files.getlist('pdfs')
    raw_text = get_pdf_text(pdf_files)
    if not raw_text.strip():
        return jsonify({"error": "No text extracted from PDFs"}), 400
    
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)
    
    return jsonify({"message": "PDFs processed successfully"})

@chatpdf_bp.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    user_question = data.get("question", "").strip()
    
    if not user_question:
        return jsonify({"error": "No question provided"}), 400
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    try:
        new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    except Exception as e:
        return jsonify({"error": f"Failed to load vector store: {str(e)}"}), 500
    
    docs = new_db.similarity_search(user_question)
    
    if not docs:
        return jsonify({"reply": "answer is not available in the context"})
    
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    
    return jsonify({"reply": response.get("output_text", "answer is not available in the context")})
