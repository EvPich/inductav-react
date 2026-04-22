import { useState } from 'react';
import {
  MapPin,
  Wrench,
  Plane,
  Calendar,
  Search,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ResultCard from '../components/ResultCard';

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

export default function SearchResultsPage({ onHome }: { onHome?: () => void }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);

  const toggleService = (svc: string) =>
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onHome={onHome} />

      {/* Search Strip */}
      <div className="bg-white border-b border-slate-200 px-10 py-3">
        <div className="max-w-[1360px] mx-auto flex items-center h-[44px] bg-slate-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 flex-1 h-full border-r border-slate-200">
            <MapPin size={16} className="text-slate-400 shrink-0" />
            <input defaultValue="Miami, FL" className="text-sm text-slate-700 bg-transparent outline-none w-full" />
          </div>
          <div className="flex items-center gap-2 px-4 flex-1 h-full border-r border-slate-200">
            <Wrench size={16} className="text-slate-400 shrink-0" />
            <input defaultValue="All Services" className="text-sm text-slate-700 bg-transparent outline-none w-full" />
          </div>
          <div className="flex items-center gap-2 px-4 flex-1 h-full border-r border-slate-200">
            <Plane size={16} className="text-slate-400 shrink-0" />
            <input defaultValue="Boeing 737" className="text-sm text-slate-700 bg-transparent outline-none w-full" />
          </div>
          <div className="flex items-center gap-2 px-4 flex-1 h-full border-r border-slate-200">
            <Calendar size={16} className="text-slate-400 shrink-0" />
            <input defaultValue="Apr 25 – May 10" className="text-sm text-slate-700 bg-transparent outline-none w-full" />
          </div>
          <button className="flex items-center gap-2 px-5 h-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors shrink-0">
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[1360px] mx-auto px-10 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-[300px] shrink-0 flex flex-col gap-6">
          {/* Location Filter */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-slate-800">Location</span>
            <div className="flex items-center gap-2 px-3 h-10 bg-white border border-slate-200 rounded-lg">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input placeholder="Search location..." className="text-[13px] text-slate-700 outline-none w-full placeholder-slate-400" />
            </div>
          </div>

          {/* Service Type */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-slate-800">Service Type</span>
            {serviceTypes.map((svc) => (
              <label key={svc} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => toggleService(svc)}
                  className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedServices.includes(svc)
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  {selectedServices.includes(svc) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-slate-700">{svc}</span>
              </label>
            ))}
          </div>

          <div className="h-px bg-slate-200" />

          {/* Availability */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-slate-800">Availability</span>
            {availabilityOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setSelectedAvailability(opt)}
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedAvailability === opt ? 'border-blue-600' : 'border-slate-300'
                  }`}
                >
                  {selectedAvailability === opt && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block" />
                  )}
                </div>
                <span className="text-[13px] text-slate-700">{opt}</span>
              </label>
            ))}
          </div>

          <div className="h-px bg-slate-200" />

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-800">Rating</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs text-slate-500">4 stars & above</span>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Price Range */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-slate-800">Price Range</span>
            <div className="flex items-center gap-2">
              <input
                placeholder="Min"
                className="flex-1 h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg outline-none placeholder-slate-400"
              />
              <span className="text-sm text-slate-500">–</span>
              <input
                placeholder="Max"
                className="flex-1 h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg outline-none placeholder-slate-400"
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-900">24 MRO facilities found</span>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:border-slate-300 transition-colors">
              Sort by: Relevance
              <ChevronDown size={16} className="text-slate-500" />
            </button>
          </div>

          {/* Cards grid (2 per row) */}
          <div className="grid grid-cols-2 gap-4">
            {sampleResults.map((r) => (
              <ResultCard key={r.name} {...r} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <ChevronLeft size={20} />
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-${
                  currentPage === p ? '600' : 'normal'
                } transition-colors ${
                  currentPage === p
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
