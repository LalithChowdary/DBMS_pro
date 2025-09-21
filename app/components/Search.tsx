'use client';

import { useState, FormEvent } from 'react';

interface SearchResult {
  doc_id: string;
  filename: string;
  score: number;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [k, setK] = useState(10);
  const [useSpellingCorrection, setUseSpellingCorrection] = useState(false);
  const [useSynonyms, setUseSynonyms] = useState(false);
  const [useSoundex, setUseSoundex] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      // Build query parameters for GET request
      const params = new URLSearchParams({
        q: query,
        use_spelling_correction: useSpellingCorrection.toString(),
        use_synonyms: useSynonyms.toString(),
        use_soundex: useSoundex.toString()
      });

      const response = await fetch(`http://localhost:8000/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Search failed. Please try again.');
      }

      const data = await response.json();
      
      // Limit results to k if specified
      const limitedResults = data.results.slice(0, k);
      setResults(limitedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col space-y-4">
            <label htmlFor="search" className="text-lg font-medium text-gray-700">
              Search Query
            </label>
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your search query..."
              required
            />
          </div>
        </div>

        {/* Search Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Search Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <input
                id="spelling-correction"
                type="checkbox"
                checked={useSpellingCorrection}
                onChange={(e) => setUseSpellingCorrection(e.target.checked)}
                className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
              />
              <label htmlFor="spelling-correction" className="text-sm text-gray-600">
                Spelling Correction
              </label>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <input
                id="synonyms"
                type="checkbox"
                checked={useSynonyms}
                onChange={(e) => setUseSynonyms(e.target.checked)}
                className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
              />
              <label htmlFor="synonyms" className="text-sm text-gray-600">
                Synonyms
              </label>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <input
                id="soundex"
                type="checkbox"
                checked={useSoundex}
                onChange={(e) => setUseSoundex(e.target.checked)}
                className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
              />
              <label htmlFor="soundex" className="text-sm text-gray-600">
                Soundex
              </label>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <input
                type="number"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                className="w-20 p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                min="1"
                max="100"
              />
              <label className="text-sm text-gray-600">
                Number of Results (K)
              </label>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Searching...</span>
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h2>
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.doc_id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <a
                      href={`/files/${result.filename}?q=${encodeURIComponent(query)}`}
                      className="text-lg font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-300"
                    >
                      {result.filename.replace('.txt', '')}
                    </a>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Relevance Score:</span>
                      <div className="bg-purple-50 rounded px-2 py-1">
                        <span className="text-purple-600 font-medium">{result.score.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}