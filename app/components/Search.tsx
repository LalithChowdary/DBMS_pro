'use client';

import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [useSpellingCorrection, setUseSpellingCorrection] = useState(false);
  const [useSynonyms, setUseSynonyms] = useState(false);
  const [useSoundex, setUseSoundex] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const params = new URLSearchParams({
        q: query,
        use_spelling_correction: String(useSpellingCorrection),
        use_synonyms: String(useSynonyms),
        use_soundex: String(useSoundex),
      });

      const response = await fetch(`http://127.0.0.1:8000/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="query">
            Search Query
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your search query"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Options</label>
          <div className="flex items-center">
            <input
              id="spelling-correction"
              type="checkbox"
              checked={useSpellingCorrection}
              onChange={(e) => setUseSpellingCorrection(e.target.checked)}
              className="mr-2 leading-tight"
            />
            <label htmlFor="spelling-correction" className="text-sm text-gray-600">
              Spelling Correction
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="synonyms"
              type="checkbox"
              checked={useSynonyms}
              onChange={(e) => setUseSynonyms(e.target.checked)}
              className="mr-2 leading-tight"
            />
            <label htmlFor="synonyms" className="text-sm text-gray-600">
              Synonyms
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="soundex"
              type="checkbox"
              checked={useSoundex}
              onChange={(e) => setUseSoundex(e.target.checked)}
              className="mr-2 leading-tight"
            />
            <label htmlFor="soundex" className="text-sm text-gray-600">
              Soundex
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <ul>
            {results.map((result: any) => (
              <li key={result.doc_id} className="mb-4 p-4 border rounded text-black">
                <p className="font-bold">
                  <a href={`/files/${result.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {result.filename}
                  </a>
                </p>
                <p>Score: {result.score}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
