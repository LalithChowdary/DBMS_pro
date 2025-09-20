import os
import math
import pickle
from collections import defaultdict
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# --- Main Indexing Logic (Step 1: Core) ---

class IndexBuilder:
    def __init__(self, corpus_path, data_path):
        self.corpus_path = corpus_path
        self.data_path = data_path
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()

        # Core index structures
        self.doc_id_map = {}
        self.postings = defaultdict(list)
        self.doc_freq = defaultdict(int)
        self.doc_len = {}
        self.term_dictionary = set()

    def build_all_indexes(self):
        """Orchestrates the core indexing process."""
        print("Starting Step 1: Core Indexing...")

        # 1. Assign Doc IDs
        self._assign_doc_ids()
        if not self.doc_id_map:
            print(f"No documents found in {self.corpus_path}. Aborting.")
            return

        # 2. Process each document
        for doc_id, doc_path in self.doc_id_map.items():
            print(f"Processing document {doc_id}: {os.path.basename(doc_path)}")
            self._process_document(doc_id, doc_path)

        # 3. Save indexes to disk
        self._save_indexes()
        print(f"Step 1 complete. Core indexes saved to {self.data_path}")

    def _assign_doc_ids(self):
        """Scans the corpus directory and assigns a unique ID to each document."""
        try:
            all_files = sorted([f for f in os.listdir(self.corpus_path) if f.endswith('.txt')])
            for i, filename in enumerate(all_files):
                self.doc_id_map[i + 1] = os.path.join(self.corpus_path, filename)
        except FileNotFoundError:
            print(f"Corpus directory not found at: {self.corpus_path}")

    def _process_document(self, doc_id, doc_path):
        try:
            with open(doc_path, 'r', encoding='utf-8', errors='ignore') as f:
                raw_content = f.read()
        except IOError as e:
            print(f"Could not read file {doc_path}: {e}")
            return

        original_tokens = word_tokenize(raw_content)
        clean_terms = self._get_clean_terms(original_tokens)
        
        local_postings = defaultdict(lambda: {'tf': 0, 'pos': []})
        for i, term in enumerate(clean_terms):
            local_postings[term]['tf'] += 1
            local_postings[term]['pos'].append(i)
            self.term_dictionary.add(term)

        doc_terms_in_current_doc = set()
        for term, data in local_postings.items():
            self.postings[term].append((doc_id, data['tf'], data['pos']))
            if term not in doc_terms_in_current_doc:
                self.doc_freq[term] += 1
                doc_terms_in_current_doc.add(term)

        weight_squared_sum = 0
        for term, data in local_postings.items():
            weight = 1 + math.log10(data['tf'])
            weight_squared_sum += weight ** 2
        self.doc_len[doc_id] = math.sqrt(weight_squared_sum)

    def _get_clean_terms(self, tokens):
        lemmatized_terms = []
        for token in tokens:
            if token.isalpha() and token.lower() not in self.stop_words:
                lemma = self.lemmatizer.lemmatize(token.lower())
                lemmatized_terms.append(lemma)
        
        bigrams = [f'{lemmatized_terms[i]}_{lemmatized_terms[i+1]}' for i in range(len(lemmatized_terms) - 1)]
        return lemmatized_terms + bigrams

    def _save_indexes(self):
        if not os.path.exists(self.data_path):
            os.makedirs(self.data_path)
            
        indexes = {
            "doc_id_map": self.doc_id_map,
            "postings": self.postings,
            "doc_freq": self.doc_freq,
            "doc_len": self.doc_len,
            "term_dictionary": list(self.term_dictionary)
        }

        for name, index in indexes.items():
            with open(os.path.join(self.data_path, f'{name}.pkl'), 'wb') as f:
                pickle.dump(index, f)

if __name__ == '__main__':
    CORPUS_DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Corpus'))
    DATA_DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
    
    from core.utils import setup_nltk
    setup_nltk()

    builder = IndexBuilder(corpus_path=CORPUS_DIRECTORY, data_path=DATA_DIRECTORY)
    builder.build_all_indexes()