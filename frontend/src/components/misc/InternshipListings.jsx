import React, { useState, useEffect } from 'react';
import { Search, MapPin, WalletCards,Clock, DollarSign, Calendar, ExternalLink, Loader2, Briefcase, Filter } from 'lucide-react';

const InternshipCard = ({ internship }) => {
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 hover:border-indigo-200">
      <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        New
      </div>
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full mb-2">
          {internship.location}
        </span>
        <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{internship.title}</h3>
        <p className="text-indigo-600 font-semibold">{internship.company}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center text-gray-700">
          <Calendar size={16} className="mr-2 text-indigo-500" />
          <span className="font-medium">{internship.duration}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <WalletCards size={16} className="mr-2 text-green-500" />
          <span className="font-medium">{internship.stipend}</span>
        </div>
        
        {internship.posted_time !== "N/A" && (
          <div className="flex items-center text-gray-700 col-span-2">
            <Clock size={16} className="mr-2 text-indigo-500" />
            <span className="font-medium">{internship.posted_time}</span>
          </div>
        )}
      </div>
      
      <div className="mt-5 pt-5 border-t border-gray-100">
        <a 
          href={internship.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Apply Now
          <ExternalLink size={16} className="ml-2" />
        </a>
      </div>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-transparent border-t-indigo-600 rounded-full absolute top-0 left-0 animate-spin"></div>
      </div>
      <p className="mt-6 text-xl text-indigo-700 font-semibold">Discovering opportunities...</p>
      <p className="text-gray-500 mt-2 max-w-sm text-center">Scraping the latest internships from across the web just for you</p>
    </div>
  );
};

const EmptyState = ({ searchTerm, clearSearch }) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
        <Search size={24} className="text-indigo-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-4">
        We couldn't find any internships matching "{searchTerm}". Try adjusting your search terms.
      </p>
      <button 
        onClick={clearSearch} 
        className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
      >
        Clear Search
      </button>
    </div>
  );
};

const InternshipListings = () => {
  const FLASK_API = import.meta.env.VITE_FLASK_API;
  const [searchTerm, setSearchTerm] = useState('');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${FLASK_API}/internships`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
          // Filter out invalid entries
          const validInternships = data.data.filter(
            internship => internship.company !== "N/A" && internship.title !== "N/A"
          );
          setInternships(validInternships);
        } else {
          throw new Error("Failed to fetch internships");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching internships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Filter based on search term
  const filteredInternships = internships.filter(
    internship => 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique locations for filters
  const locations = [...new Set(internships.map(item => item.location))];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 mb-3">Internship Explorer</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Discover and apply to the latest internship opportunities from top companies across India</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by role, company or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">Locations</h3>
              <div className="flex flex-wrap gap-2">
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => setSearchTerm(location)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full hover:bg-indigo-200"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl text-center shadow-md">
            <p className="font-semibold text-lg mb-1">Failed to load internships</p>
            <p className="text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              Try Again
            </button>
          </div>
        ) : filteredInternships.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {filteredInternships.length} Internships Available
              </h2>
              <div className="flex items-center text-gray-600">
                <Briefcase size={16} className="mr-2" />
                <span className="font-medium">Latest Opportunities</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInternships.map((internship, index) => (
                <InternshipCard key={index} internship={internship} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState searchTerm={searchTerm} clearSearch={() => setSearchTerm('')} />
        )}
        
        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">
              <span className="font-medium text-indigo-600">Internship Explorer</span> • 
              Last updated {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipListings;