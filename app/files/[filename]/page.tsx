'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function FilePage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const params = useParams();
  const filename = params.filename as string;

  useEffect(() => {
    if (filename) {
      const fetchFileContent = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/files/${filename}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Something went wrong');
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
  }, [filename]);

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
        <pre className="text-black whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
}
