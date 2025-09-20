import math
from collections import defaultdict

# --- Query Processing and Ranking Logic (Step 2: Advanced) ---

def jaccard_similarity(set1, set2):
    """Calculates Jaccard similarity between two sets."""
    if not isinstance(set1, set) or not isinstance(set2, set):
        return 0
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union != 0 else 0

def get_spelling_correction(term, kgram_index, term_dictionary):
    """Finds the best spelling correction for a term."""
    if term in term_dictionary: return term

    k = 3 # Same k as used in indexing
    padded_term = f'${term}$'
    if len(padded_term) < k: return term

    term_kgrams = set([padded_term[i:i+k] for i in range(len(padded_term) - k + 1)])
    
    candidate_terms = set()
    for kgram in term_kgrams:
        candidate_terms.update(kgram_index.get(kgram, set()))

    if not candidate_terms: return term

    # Find the best candidate based on Jaccard similarity of their k-gram sets
    best_candidate = max(candidate_terms, 
                         key=lambda c: jaccard_similarity(
                             term_kgrams, 
                             set([f'${c}$'[j:j+k] for j in range(len(f'${c}$' ) - k + 1)])
                         ))
    
    return best_candidate

def process_and_expand_query(query, lemmatizer, stop_words, synonym_map, kgram_index, term_dictionary, soundex_map, generate_soundex_func):
    """Takes a raw query and returns a list of weighted terms after full processing."""
    query_terms = query.lower().split()
    
    processed_terms = []
    for term in query_terms:
        if term in stop_words: continue
        
        # Spelling Correction on the original term
        corrected_term = get_spelling_correction(term, kgram_index, term_dictionary)
        
        # Lemmatization
        lemma = lemmatizer.lemmatize(corrected_term)
        processed_terms.append((lemma, 1.0)) # Original terms have full weight

        # Synonym Expansion
        synonyms = synonym_map.get(lemma, [])
        for syn in synonyms:
            processed_terms.append((syn, 0.5)) # Synonyms have half weight

        # Soundex Expansion for capitalized original terms
        if term and term[0].isupper():
            soundex_code = generate_soundex_func(term)
            similar_names = soundex_map.get(soundex_code, [])
            for name in similar_names:
                if name != term.lower():
                    processed_terms.append((name, 0.7)) # Phonetic matches have a high weight

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