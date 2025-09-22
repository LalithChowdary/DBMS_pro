import Search from './components/Search';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-black">
              VectorSearch
            </div>
			{/* Removed nav links for a minimal header */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-light text-black mb-6 leading-tight">
            Vector Space
            <br />
            <span className="font-normal">Search Engine</span>
          </h1>
			{/* Removed subtitle for a cleaner hero */}
        </div>

        {/* Search Component Container */}
        <div className="max-w-4xl mx-auto">
          <Search />
        </div>

		{/* Removed stats and features sections for a cleaner minimal layout */}
      </div>

		{/* Footer removed for minimal layout */}
    </main>
  );
}