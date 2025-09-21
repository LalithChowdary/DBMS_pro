import Search from './components/Search';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              VectorSearch
            </span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 text-sm text-purple-300">
              🚀 Advanced Search Technology
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-6 leading-tight">
            Vector Space
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Search Engine
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the next generation of document search with intelligent ranking, 
            spelling correction, synonyms, and proximity-based results.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Started
            </button>
            <button className="border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 font-semibold py-3 px-8 rounded-full transition-all duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>

        {/* Search Component Container */}
        <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl border border-white/10 p-2">
          <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-1">
            <Search />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20 text-center">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
              40+
            </div>
            <div className="text-gray-300">Documents Indexed</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-2">
              99.9%
            </div>
            <div className="text-gray-300">Search Accuracy</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
              &lt;100ms
            </div>
            <div className="text-gray-300">Response Time</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-2">
              5+
            </div>
            <div className="text-gray-300">Search Features</div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced search capabilities that make finding information effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Smart Ranking</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced vector space model with intelligent ranking algorithms that understand context and relevance.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Advanced Filters</h3>
              <p className="text-gray-300 leading-relaxed">
                Spelling correction, synonym expansion, and proximity search for precise and comprehensive results.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Rich Content</h3>
              <p className="text-gray-300 leading-relaxed">
                Search across diverse document types with support for multiple formats and content structures.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Next-Gen Search?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have revolutionized their document search experience.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
              Start Searching Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 VectorSearch. Built with Next.js and advanced search algorithms.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}