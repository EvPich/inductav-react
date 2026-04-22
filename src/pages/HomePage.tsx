import {
  MapPin,
  Wrench,
  Plane,
  Calendar,
  Search,
  Cog,
  Disc3,
  SlidersHorizontal,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import MROCard from '../components/MROCard';
import MROCardHorizontal from '../components/MROCardHorizontal';
import Footer from '../components/Footer';

const categories = [
  { icon: <Plane size={32} className="text-white" />, label: 'Aircraft' },
  { icon: <Cog size={32} className="text-white" />, label: 'Components\n& Parts' },
  { icon: <Disc3 size={32} className="text-white" />, label: 'Wheels\n& Brakes' },
  { icon: <SlidersHorizontal size={32} className="text-white" />, label: 'Configuration\n& Evaluation' },
];

const immediateCards = [
  { name: 'SR Technics', location: 'Zurich, Switzerland', serviceType: 'General MRO' },
  { name: 'Air France Industries', location: 'Paris, France', serviceType: 'Engine MRO' },
  { name: 'ST Engineering', location: 'Singapore', serviceType: 'General MRO' },
  { name: 'Iberia MRO', location: 'Madrid, Spain', serviceType: 'Painting' },
  { name: 'HAECO', location: 'Hong Kong', serviceType: 'Landing Gear' },
  { name: 'Turkish Technic', location: 'Istanbul, Turkey', serviceType: 'APU Services' },
];

type CategorySection = { title: string; cards: { name: string; location: string }[] };

const categorySections: CategorySection[] = [
  {
    title: 'General MRO',
    cards: [
      { name: 'SR Technics', location: 'Zurich, Switzerland' },
      { name: 'Sabena technics', location: 'Brussels, Belgium' },
      { name: 'Abu Dhabi Aviation', location: 'Abu Dhabi, UAE' },
      { name: 'MRO Holdings', location: 'Dallas, TX, USA' },
    ],
  },
  {
    title: 'Landing Gear Shop',
    cards: [
      { name: 'Messier Services', location: 'Paris, France' },
      { name: 'Lufthansa Technik', location: 'Hamburg, Germany' },
      { name: 'AAR Landing Gear', location: 'Indianapolis, USA' },
      { name: 'BBA Aviation', location: 'London, UK' },
    ],
  },
  {
    title: 'Painting',
    cards: [
      { name: 'Coopesa', location: 'San Jose, Costa Rica' },
      { name: 'AeroCentury', location: 'San Carlos, CA, USA' },
      { name: 'Ducommun', location: 'Santa Ana, CA, USA' },
      { name: 'AeroPaint Ltd', location: 'Manchester, UK' },
    ],
  },
  {
    title: 'Engine MRO',
    cards: [
      { name: 'MTU Maintenance', location: 'Hannover, Germany' },
      { name: 'GE Aviation', location: 'Cincinnati, OH, USA' },
      { name: 'Pratt & Whitney MRO', location: 'East Hartford, CT, USA' },
      { name: 'Rolls-Royce TotalCare', location: 'Derby, UK' },
    ],
  },
  {
    title: 'APU Services',
    cards: [
      { name: 'Duncan Aviation', location: 'Lincoln, NE, USA' },
      { name: 'Honeywell APU', location: 'Phoenix, AZ, USA' },
      { name: 'StandardAero', location: 'Scottsdale, AZ, USA' },
      { name: 'FL Technics', location: 'Vilnius, Lithuania' },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-900 relative">
        <Navbar transparent />

        <div className="max-w-[1360px] mx-auto px-10 pt-20 pb-16">
          <h1 className="text-[56px] font-extrabold text-white leading-tight max-w-[900px] mb-4">
            Secure MRO Slots in Minutes,
            <br />
            Not Weeks
          </h1>
          <p className="text-lg text-slate-300 max-w-[700px] mb-10">
            The world's leading aviation maintenance marketplace. Compare certified MRO facilities,
            check real-time availability, and book slots instantly.
          </p>

          {/* Search Bar */}
          <div className="w-[1100px] max-w-full bg-white rounded-2xl shadow-xl flex items-center h-[64px] overflow-hidden">
            <div className="flex items-center gap-2 px-5 flex-1 h-full border-r border-slate-200">
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <input placeholder="Location" className="text-sm text-slate-700 outline-none w-full placeholder-slate-400" />
            </div>
            <div className="flex items-center gap-2 px-5 flex-1 h-full border-r border-slate-200">
              <Wrench size={18} className="text-slate-400 shrink-0" />
              <input placeholder="Service Type" className="text-sm text-slate-700 outline-none w-full placeholder-slate-400" />
            </div>
            <div className="flex items-center gap-2 px-5 flex-1 h-full border-r border-slate-200">
              <Plane size={18} className="text-slate-400 shrink-0" />
              <input placeholder="Aircraft Type" className="text-sm text-slate-700 outline-none w-full placeholder-slate-400" />
            </div>
            <div className="flex items-center gap-2 px-5 flex-1 h-full border-r border-slate-200">
              <Calendar size={18} className="text-slate-400 shrink-0" />
              <input placeholder="Date" className="text-sm text-slate-700 outline-none w-full placeholder-slate-400" />
            </div>
            <button className="flex items-center gap-2 px-6 h-full bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold transition-colors shrink-0">
              <Search size={18} />
              Search
            </button>
          </div>

          {/* Category Icons */}
          <div className="flex gap-4 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className="w-[170px] flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] transition-colors cursor-pointer"
              >
                {cat.icon}
                <span className="text-[13px] font-medium text-white text-center whitespace-pre-line">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Immediate Availability */}
      <section className="max-w-[1360px] mx-auto px-10 py-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <h2 className="text-[32px] font-bold text-slate-900">Immediate Availability</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {immediateCards.map((card) => (
            <MROCard key={card.name} {...card} />
          ))}
        </div>
      </section>

      {/* World Map */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-[1360px] mx-auto px-10">
          <h2 className="text-[32px] font-bold text-white mb-2">Global MRO Network</h2>
          <p className="text-base text-slate-400 mb-8">
            Access certified maintenance facilities across 6 continents
          </p>
          <div className="w-[1200px] max-w-full h-[500px] bg-slate-800 rounded-2xl flex items-end justify-start p-6 relative overflow-hidden">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
              Interactive World Map
            </div>
            {/* Pill */}
            <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[13px] font-semibold text-emerald-400">
                142 Facilities Available Now
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categorySections.map((section) => (
        <section key={section.title} className="max-w-[1360px] mx-auto px-10 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{section.title}</h2>
          <div className="flex gap-4 flex-wrap">
            {section.cards.map((card) => (
              <MROCardHorizontal key={card.name} name={card.name} location={card.location} />
            ))}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
