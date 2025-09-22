import math
from collections import defaultdict

# --- Query Processing and Ranking Logic  ---

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

from nltk.tokenize import word_tokenize

def process_and_expand_query(
    query, lemmatizer, stop_words, synonym_map, kgram_index, term_dictionary, 
    soundex_map, generate_soundex_func, use_spelling_correction=False, 
    use_synonyms=False, use_soundex=False
):
   
    
    # 1. Generate unigrams (lemmas), EXACTLY mirroring the indexing pipeline
    raw_tokens = word_tokenize(query)
    unigrams = []
    # Keep track of the original words for casing-sensitive features like Soundex
    original_words_for_unigrams = {}
    for token in raw_tokens:
        if token.isalpha() and token.lower() not in stop_words:
            lemma = lemmatizer.lemmatize(token.lower())
            unigrams.append(lemma)
            if lemma not in original_words_for_unigrams:
                original_words_for_unigrams[lemma] = token

    # 2. Generate bigrams from the unigrams
    bigrams = [f'{unigrams[i]}_{unigrams[i+1]}' for i in range(len(unigrams) - 1)]

   
    final_query_terms = []

    # Add unigrams first
    for unigram in unigrams:
        term_to_process = unigram
        # Apply spelling correction if enabled
        if use_spelling_correction:
            term_to_process = get_spelling_correction(unigram, kgram_index, term_dictionary)
        final_query_terms.append(term_to_process)

        # Apply synonym expansion if enabled
        if use_synonyms:
            synonyms = synonym_map.get(term_to_process, [])
            
            final_query_terms.extend(synonyms)

        # Apply Soundex expansion if enabled
        original_word = original_words_for_unigrams.get(unigram, "")
        if use_soundex and original_word and original_word[0].isupper():
            soundex_code = generate_soundex_func(original_word)
            similar_names = soundex_map.get(soundex_code, [])
            final_query_terms.extend([name for name in similar_names if name != original_word.lower()])

    # Add bigrams to the query vector
    final_query_terms.extend(bigrams)

   
    return [(term, 1.0) for term in final_query_terms]

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

    # Sort results and return all ranked docs; caller can slice to desired k
    sorted_docs = sorted(doc_scores.items(), key=lambda item: (-item[1], item[0]))
    return sorted_docs