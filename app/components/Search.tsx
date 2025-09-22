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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setCurrentPage(1);

    try {
      // Build query parameters for GET request
      const params = new URLSearchParams({
        q: query,
        k: String(k),
        use_spelling_correction: useSpellingCorrection.toString(),
        use_synonyms: useSynonyms.toString(),
        use_soundex: useSoundex.toString()
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Search failed. Please try again.');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Search Input */}
        <div className="border border-gray-200 p-6">
          <div className="flex flex-col space-y-4">
            <label htmlFor="search" className="text-sm font-medium text-black">
              Search Query
            </label>
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-4 border border-gray-300 focus:border-black focus:outline-none text-lg"
              placeholder="Enter your search query..."
              required
            />
          </div>
        </div>

        {/* Search Options */}
        <div className="border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-black mb-6">Search Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <input
                id="spelling-correction"
                type="checkbox"
                checked={useSpellingCorrection}
                onChange={(e) => setUseSpellingCorrection(e.target.checked)}
                className="w-4 h-4 border border-gray-300 focus:border-black"
              />
              <label htmlFor="spelling-correction" className="text-sm text-gray-600">
                Spelling Correction
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="synonyms"
                type="checkbox"
                checked={useSynonyms}
                onChange={(e) => setUseSynonyms(e.target.checked)}
                className="w-4 h-4 border border-gray-300 focus:border-black"
              />
              <label htmlFor="synonyms" className="text-sm text-gray-600">
                Synonyms
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="soundex"
                type="checkbox"
                checked={useSoundex}
                onChange={(e) => setUseSoundex(e.target.checked)}
                className="w-4 h-4 border border-gray-300 focus:border-black"
              />
              <label htmlFor="soundex" className="text-sm text-gray-600">
                Soundex
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                className="w-20 p-2 border border-gray-300 focus:border-black focus:outline-none"
                min="1"
                max="100"
              />
              <label className="text-sm text-gray-600">
                Number of Results
              </label>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-12 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
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
        <div className="mt-6 p-4 border border-gray-300 bg-gray-50">
          <p className="text-black">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-light text-black mb-8">Search Results</h2>
          <div className="space-y-4">
            {results
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((result) => (
              <div
                key={result.doc_id}
                className="border border-gray-200 p-6 hover:border-black transition-colors duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <a
                      href={`/files/${result.filename}?q=${encodeURIComponent(query)}`}
                      className="text-lg font-medium text-black hover:text-gray-600 transition-colors duration-300"
                    >
                      {result.filename.replace('.txt', '')}
                    </a>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Score:</span>
                      <span className="text-sm text-black font-medium">{result.score.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 text-black disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {Math.max(1, Math.ceil(results.length / pageSize))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(results.length / pageSize), p + 1))}
              disabled={currentPage >= Math.ceil(results.length / pageSize)}
              className="px-4 py-2 border border-gray-300 text-black disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}