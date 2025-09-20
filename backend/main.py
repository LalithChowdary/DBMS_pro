import os
import pickle
from fastapi import FastAPI, HTTPException
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

# Import our custom modules
from core.indexing import IndexBuilder, generate_soundex
from core.ranking import process_and_expand_query, rank_results

# --- Globals and Setup ---

app = FastAPI(
    title="Vector Space Search Engine",
    description="A search engine based on the vector space model with advanced query processing."
)

# Global variables to hold the loaded indexes
INDEXES = {}
LEMMATIZER = WordNetLemmatizer()
STOP_WORDS = set(stopwords.words('english'))
DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))

# --- Helper Functions ---

def load_indexes():
    """Loads all index files from the data directory into memory."""
    print(f"Loading indexes from {DATA_PATH}...")
    index_names = [
        "doc_id_map", "postings", "doc_freq", "doc_len", 
        "term_dictionary", "soundex_map", "kgram_index", "synonym_map"
    ]
    for name in index_names:
        path = os.path.join(DATA_PATH, f'{name}.pkl')
        try:
            with open(path, 'rb') as f:
                INDEXES[name] = pickle.load(f)
        except FileNotFoundError:
            print(f"Warning: Index file not found at {path}. Please run indexing.")
            # Allow server to start, but search will fail.
            INDEXES[name] = {} if 'map' in name or 'postings' in name else []
    print("Indexes loaded successfully.")

# --- FastAPI Events ---

@app.on_event("startup")
async def startup_event():
    """On server startup, load all the indexes into memory."""
    load_indexes()

# --- API Endpoints ---

@app.get("/search", summary="Perform a search query")
async def search(q: str):
    """
    Performs a search query against the indexed documents.
    - `q`: The search query string.
    """
    if not q:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    if not INDEXES.get("doc_id_map"): # Check if indexes are loaded
        raise HTTPException(status_code=503, detail="Indexes are not loaded. Please run the indexing process.")

    # 1. Process and expand the query
    processed_query_terms = process_and_expand_query(
        query=q,
        lemmatizer=LEMMATIZER,
        stop_words=STOP_WORDS,
        synonym_map=INDEXES["synonym_map"],
        kgram_index=INDEXES["kgram_index"],
        term_dictionary=set(INDEXES["term_dictionary"]),
        soundex_map=INDEXES["soundex_map"],
        generate_soundex_func=generate_soundex
    )

    # 2. Rank the results
    ranked_doc_ids = rank_results(
        query_terms=processed_query_terms,
        postings=INDEXES["postings"],
        doc_freq=INDEXES["doc_freq"],
        doc_len=INDEXES["doc_len"]
    )

    # 3. Format the results
    results = []
    doc_id_map = INDEXES["doc_id_map"]
    for doc_id, score in ranked_doc_ids:
        results.append({
            "doc_id": doc_id,
            "filename": os.path.basename(doc_id_map.get(doc_id, "Unknown File")),
            "score": score
        })

    return {"query": q, "results": results}

@app.post("/re-index", summary="Trigger the indexing process")
async def re_index():
    """
    Triggers the full indexing process. 
    NOTE: This is a synchronous and long-running operation. 
    The server will be unresponsive until it completes.
    """
    try:
        corpus_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Corpus'))
        builder = IndexBuilder(corpus_path=corpus_path, data_path=DATA_PATH)
        builder.build_all_indexes()
        
        # Reload indexes into memory after build is complete
        load_indexes()
        
        return {"message": "Re-indexing completed and new indexes are loaded."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during indexing: {e}")

# To run the server, use the command:
# uvicorn main:app --reload --app-dir backend