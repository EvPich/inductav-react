import { useState } from 'react';
import { Search, Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';

const TEAL = '#57A091';

const serviceTypes = ['General', 'Landing Gear', 'Painting', 'Engine', 'APU', 'Avionics'];
const availabilityOptions = ['Any', 'Available Now', 'Next 7 Days', 'Next 30 Days'];

const sampleResults = [
  { name: 'Lufthansa Technik Shannon', location: 'Shannon, Ireland', rating: 4.8, serviceTypes: ['C-Check', 'General'], priceRange: '$800K – $1.2M' },
  { name: 'SR Technics', location: 'Zurich, Switzerland', rating: 4.6, serviceTypes: ['General MRO'], priceRange: '$200K – $600K' },
  { name: 'Air France Industries KLM', location: 'Paris, France', rating: 4.7, serviceTypes: ['Engine', 'General'], priceRange: '$500K – $900K' },
  { name: 'ST Engineering Aerospace', location: 'Singapore', rating: 4.5, serviceTypes: ['General MRO'], priceRange: '$150K – $400K' },
  { name: 'Turkish Technic', location: 'Istanbul, Turkey', rating: 4.4, serviceTypes: ['Painting', 'General'], priceRange: '$120K – $350K' },
  { name: 'HAECO', location: 'Hong Kong', rating: 4.6, serviceTypes: ['Landing Gear'], priceRange: '$200K – $500K' },
  { name: 'Iberia MRO', location: 'Madrid, Spain', rating: 4.3, serviceTypes: ['Painting'], priceRange: '$100K – $250K' },
  { name: 'MTU Maintenance', location: 'Hannover, Germany', rating: 4.9, serviceTypes: ['Engine MRO'], priceRange: '$1M – $3M' },
];

export default function SearchResultsPage({ onHome, onViewProfile }: { onHome?: () => void; onViewProfile?: () => void }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);

  const toggleService = (svc: string) =>
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      <Navbar onHome={onHome} />

      {/* Search strip */}
      <div className="bg-white border-b border-slate-200 px-10 py-3">
        <div className="max-w-[1360px] mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[1360px] mx-auto px-10 py-8 flex gap-8">

        {/* Sidebar filters */}
        <aside className="w-[300px] shrink-0 flex flex-col gap-6">

          {/* Location */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Location</span>
            <div className="flex items-center gap-2 px-3 h-10 bg-white rounded-lg" style={{ border: '1px solid #E2E8F0' }}>
              <Search size={16} color="#94A3B8" className="shrink-0" />
              <input
                placeholder="Search location..."
                className="text-[13px] outline-none w-full bg-transparent"
                style={{ color: '#1E293B' }}
              />
            </div>
          </div>

          {/* Service Type */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Service Type</span>
            {serviceTypes.map((svc) => {
              const checked = selectedServices.includes(svc);
              return (
                <label key={svc} className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => toggleService(svc)}
                    className="w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: checked ? TEAL : '#FFFFFF',
                      border: `2px solid ${checked ? TEAL : '#CBD5E1'}`,
                    }}
                  >
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px]" style={{ color: '#475569' }}>{svc}</span>
                </label>
              );
            })}
          </div>

          <div className="h-px" style={{ backgroundColor: '#E2E8F0' }} />

          {/* Availability */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Availability</span>
            {availabilityOptions.map((opt) => {
              const selected = selectedAvailability === opt;
              return (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setSelectedAvailability(opt)}
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{ border: `2px solid ${selected ? TEAL : '#CBD5E1'}` }}
                  >
                    {selected && (
                      <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: TEAL }} />
                    )}
                  </div>
                  <span className="text-[13px]" style={{ color: '#475569' }}>{opt}</span>
                </label>
              );
            })}
          </div>

          <div className="h-px" style={{ backgroundColor: '#E2E8F0' }} />

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Rating</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs" style={{ color: '#94A3B8' }}>4 stars & above</span>
          </div>

          <div className="h-px" style={{ backgroundColor: '#E2E8F0' }} />

          {/* Price Range */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Price Range</span>
            <div className="flex items-center gap-2">
              <input
                placeholder="Min"
                className="flex-1 h-10 px-3 text-sm bg-white rounded-lg outline-none"
                style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
              />
              <span className="text-sm" style={{ color: '#94A3B8' }}>–</span>
              <input
                placeholder="Max"
                className="flex-1 h-10 px-3 text-sm bg-white rounded-lg outline-none"
                style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold" style={{ color: '#1E293B' }}>24 MRO facilities found</span>
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-[13px] transition-colors"
              style={{ border: '1px solid #E2E8F0', color: '#475569' }}
            >
              Sort by: Relevance
              <ChevronDown size={16} color="#94A3B8" />
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            {sampleResults.map((r) => (
              <ResultCard key={r.name} {...r} onViewProfile={onViewProfile} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
              <ChevronLeft size={20} color="#94A3B8" />
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: currentPage === p ? TEAL : 'transparent',
                  color: currentPage === p ? '#FFFFFF' : '#475569',
                  fontWeight: currentPage === p ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (currentPage !== p) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                onMouseLeave={(e) => { if (currentPage !== p) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {p}
              </button>
            ))}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
              <ChevronRight size={20} color="#94A3B8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
