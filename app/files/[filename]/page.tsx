'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function FilePage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const params = useParams();
  const searchParams = useSearchParams();
  const filename = params.filename as string;
  const query = searchParams.get('q');

  useEffect(() => {
    if (filename) {
      const fetchFileContent = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/files/${filename}`);
          if (!response.ok) {
            throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
          }
          const text = await response.text();
          setContent(text);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchFileContent();
    }
  }, [filename, query]);

  const highlightContent = (text: string, searchQuery: string | null) => {
    if (!searchQuery?.trim()) return text;
    
    // Clean up the query and escape special regex characters
    const cleanQuery = searchQuery
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')  // Escape special regex chars
      .trim();
    
    // First try to highlight the complete phrase
    const phraseRegex = new RegExp(`\\b(${cleanQuery})\\b`, 'gi');
    const hasMatches = phraseRegex.test(text);
    
    if (hasMatches) {
      // If complete phrase matches exist, highlight only those
      return text.replace(phraseRegex, '<mark style="background-color: yellow; color: black;">$1</mark>');
    } else {
      // If no complete phrase match, highlight individual complete words
      const terms = cleanQuery
        .split(/\s+/)
        .filter(term => term.length > 2)  // Only highlight words with 3 or more characters
        .map(term => `\\b${term}\\b`);    // Add word boundaries
      
      if (terms.length === 0) return text;
      
      const regex = new RegExp(`(${terms.join('|')})`, 'gi');
      return text.replace(regex, '<mark style="background-color: yellow; color: black;">$1</mark>');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{filename}</h1>
      <div className="overflow-x-auto bg-gray-100 p-4 rounded-md">
        <pre 
          className="text-black whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ 
            __html: highlightContent(content, query)
          }}
        />
      </div>
    </div>
  );
}
