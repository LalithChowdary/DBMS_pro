
import math
from collections import defaultdict

# --- Query Processing and Ranking Logic (Step 1: Core) ---

def process_query_simple(query, lemmatizer, stop_words):
    """Takes a raw query and performs basic normalization."""
    processed_terms = []
    for term in query.lower().split():
        if term not in stop_words:
            lemma = lemmatizer.lemmatize(term)
            processed_terms.append((lemma, 1.0)) # All terms have weight 1.0
    return processed_terms

def rank_results(query_terms, postings, doc_freq, doc_len):
    """Ranks documents based on the lnc.ltc scheme."""
    total_docs = len(doc_len)
    query_tf = defaultdict(float)
    for term, weight in query_terms:
        query_tf[term] += weight

    # Calculate query vector (ltc)
    query_vector = {}
    query_length_sq = 0
    for term, tf in query_tf.items():
        if term not in doc_freq or doc_freq[term] == 0:
            continue
        
        idf = math.log10(total_docs / doc_freq[term])
        w_qt = (1 + math.log10(tf)) * idf
        query_vector[term] = w_qt
        query_length_sq += w_qt ** 2
    
    query_length = math.sqrt(query_length_sq) if query_length_sq > 0 else 1

    # Calculate document scores (accumulator)
    doc_scores = defaultdict(float)
    for term, w_qt in query_vector.items():
        if term not in postings: continue
        
        for doc_id, tf_d, _ in postings[term]:
            w_dt = 1 + math.log10(tf_d)
            doc_scores[doc_id] += w_dt * w_qt

    # Normalize scores
    for doc_id in doc_scores:
        if doc_id in doc_len and doc_len[doc_id] > 0:
            doc_scores[doc_id] /= (doc_len[doc_id] * query_length)

    # Sort results
    sorted_docs = sorted(doc_scores.items(), key=lambda item: (-item[1], item[0]))
    
    return sorted_docs[:10]
