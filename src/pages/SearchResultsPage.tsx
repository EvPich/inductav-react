import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';

const TEAL = '#57A091';

const serviceTypes = ['General', 'Landing Gear', 'Painting', 'Engine', 'APU', 'Avionics', 'Parking'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = ['2026', '2027', '2028'];

const sortOptions = [
  'Relevance',
  'Earliest Date Available',
  'Price Low to High',
  'Price High to Low',
  'Proximity to location',
];

const sampleResults = [
  { name: 'Lufthansa Technik Shannon', location: 'Shannon, Ireland', rating: 4.8, serviceTypes: ['C-Check', 'General'], priceRange: '$800K – $1.2M', imageUrl: '/lufthansa-technik.jpg' },
  { name: 'SR Technics', location: 'Zurich, Switzerland', rating: 4.6, serviceTypes: ['General MRO'], priceRange: '$200K – $600K', imageUrl: '/sr-technics.jpg' },
  { name: 'Air France Industries KLM', location: 'Paris, France', rating: 4.7, serviceTypes: ['Engine', 'General'], priceRange: '$500K – $900K', imageUrl: '/air-france.jpg' },
  { name: 'ST Engineering Aerospace', location: 'Singapore', rating: 4.5, serviceTypes: ['General MRO'], priceRange: '$150K – $400K', imageUrl: '/st-engineering.jpg' },
  { name: 'Turkish Technic', location: 'Istanbul, Turkey', rating: 4.4, serviceTypes: ['Painting', 'General'], priceRange: '$120K – $350K', imageUrl: '/turkish-technic.jpg' },
  { name: 'HAECO', location: 'Hong Kong', rating: 4.6, serviceTypes: ['Landing Gear'], priceRange: '$200K – $500K', imageUrl: '/haeco.jpg' },
  { name: 'Iberia MRO', location: 'Madrid, Spain', rating: 4.3, serviceTypes: ['Painting'], priceRange: '$100K – $250K', imageUrl: '/iberia.jpg' },
  { name: 'MTU Maintenance', location: 'Hannover, Germany', rating: 4.9, serviceTypes: ['Engine MRO'], priceRange: '$1M – $3M', imageUrl: '/mtu-maintenance.jpg' },
];

function formatPrice(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${Math.round(val / 1000)}K`;
}

export default function SearchResultsPage({ onHome, onViewProfile }: { onHome?: () => void; onViewProfile?: () => void }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [availFromMonth, setAvailFromMonth] = useState('May');
  const [availFromYear, setAvailFromYear] = useState('2026');
  const [availToMonth, setAvailToMonth] = useState('Aug');
  const [availToYear, setAvailToYear] = useState('2026');
  const [minPrice, setMinPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Relevance');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleService = (svc: string) =>
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );

  const minPct = (minPrice / 5000000) * 100;
  const maxPct = (maxPrice / 5000000) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      <Navbar onHome={onHome} />

      {/* Mobile filter bar */}
      <div className="flex sm:hidden items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <span className="text-sm text-slate-500">All Locations · All Services</span>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 bg-white">
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* Desktop search strip */}
      <div className="hidden sm:block border-b border-slate-200 px-4 md:px-8 lg:px-10 py-3" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="max-w-[1360px] mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-8 flex gap-6 lg:gap-8">

        {/* Sidebar filters */}
        <aside className="hidden lg:flex w-[260px] xl:w-[300px] shrink-0 flex-col gap-6">

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

          {/* Availability Range */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Availability Window</span>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>From</span>
              <div className="flex gap-2">
                <select
                  value={availFromMonth}
                  onChange={(e) => setAvailFromMonth(e.target.value)}
                  className="flex-1 h-9 px-2 text-xs rounded-lg outline-none bg-white"
                  style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
                >
                  {MONTHS.map((m) => <option key={m}>{m}</option>)}
                </select>
                <select
                  value={availFromYear}
                  onChange={(e) => setAvailFromYear(e.target.value)}
                  className="w-[70px] h-9 px-2 text-xs rounded-lg outline-none bg-white"
                  style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
                >
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>To</span>
              <div className="flex gap-2">
                <select
                  value={availToMonth}
                  onChange={(e) => setAvailToMonth(e.target.value)}
                  className="flex-1 h-9 px-2 text-xs rounded-lg outline-none bg-white"
                  style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
                >
                  {MONTHS.map((m) => <option key={m}>{m}</option>)}
                </select>
                <select
                  value={availToYear}
                  onChange={(e) => setAvailToYear(e.target.value)}
                  className="w-[70px] h-9 px-2 text-xs rounded-lg outline-none bg-white"
                  style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
                >
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="h-px" style={{ backgroundColor: '#E2E8F0' }} />

          {/* Price Range bar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Price Range</span>
              <span className="text-xs font-medium" style={{ color: TEAL }}>
                {formatPrice(minPrice)} – {formatPrice(maxPrice)}
              </span>
            </div>

            {/* Visual track */}
            <div className="relative h-5 flex items-center">
              <div className="absolute w-full h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }} />
              <div
                className="absolute h-1.5 rounded-full"
                style={{ left: `${minPct}%`, right: `${100 - maxPct}%`, backgroundColor: TEAL }}
              />
              <input
                type="range" min={50000} max={5000000} step={50000}
                value={minPrice}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v < maxPrice) setMinPrice(v);
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: minPrice > maxPrice - 500000 ? 5 : 3 }}
              />
              <input
                type="range" min={50000} max={5000000} step={50000}
                value={maxPrice}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v > minPrice) setMaxPrice(v);
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: 4 }}
              />
            </div>

            <div className="flex justify-between text-[11px]" style={{ color: '#94A3B8' }}>
              <span>$50K</span>
              <span>$5M+</span>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold" style={{ color: '#1E293B' }}>24 MRO facilities found</span>

            {/* Sort by dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setSortOpen((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-[13px] transition-colors"
                style={{ border: '1px solid #E2E8F0', color: '#475569' }}
              >
                Sort by: {sortBy}
                <ChevronDown size={16} color="#94A3B8" />
              </button>
              {sortOpen && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg z-30 overflow-hidden"
                  style={{ border: '1px solid #E2E8F0', minWidth: 220 }}
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-slate-50"
                      style={{ color: sortBy === opt ? TEAL : '#1E293B' }}
                    >
                      {opt}
                      {sortBy === opt && <Check size={14} color={TEAL} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
