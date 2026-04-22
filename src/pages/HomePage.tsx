import { Plane, Cog, Disc3, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import MROCard from '../components/MROCard';
import MROCardHorizontal from '../components/MROCardHorizontal';
import Footer from '../components/Footer';

const NAVY = '#1C2B4A';
const BG_LIGHT = '#F5F7FA';
const TEXT_PRIMARY = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';
const GREEN = '#22C55E';

const categories = [
  { icon: <Plane size={32} color="#FFFFFF" />, label: 'Aircraft' },
  { icon: <Cog size={32} color="#FFFFFF" />, label: 'Components\n& Parts' },
  { icon: <Disc3 size={32} color="#FFFFFF" />, label: 'Wheels\n& Brakes' },
  { icon: <SlidersHorizontal size={32} color="#FFFFFF" />, label: 'Configuration\n& Evaluation' },
];

const immediateRow1 = [
  { name: 'Lufthansa Technik', location: 'Hamburg, Germany', serviceType: 'General MRO', available: true },
  { name: 'ST Aerospace', location: 'Singapore', serviceType: 'Engine MRO', available: true },
  { name: 'HAECO', location: 'Hong Kong, China', serviceType: 'Components', available: true },
];

const immediateRow2 = [
  { name: 'AAR Corp', location: 'Miami, USA', serviceType: 'Landing Gear', available: false },
  { name: 'Turkish Technic', location: 'Istanbul, Turkey', serviceType: 'Painting', available: true },
  { name: 'Iberia Maintenance', location: 'Madrid, Spain', serviceType: 'APU Services', available: false },
];

type CategorySection = { title: string; bg: string; cards: { name: string; location: string }[] };

const categorySections: CategorySection[] = [
  {
    title: 'General MRO', bg: '#FFFFFF',
    cards: [
      { name: 'Lufthansa Technik', location: 'Hamburg, Germany' },
      { name: 'Ameco Beijing', location: 'Beijing, China' },
      { name: 'GAMECO', location: 'Guangzhou, China' },
      { name: 'SIA Engineering', location: 'Singapore' },
    ],
  },
  {
    title: 'Landing Gear Shop', bg: BG_LIGHT,
    cards: [
      { name: 'Safran Landing', location: 'Gloucester, UK' },
      { name: 'Liebherr Aerospace', location: 'Lindenberg, Germany' },
      { name: 'Triumph Group', location: 'Cleveland, USA' },
      { name: 'Messier-Bugatti', location: 'Vélizy, France' },
    ],
  },
  {
    title: 'Painting', bg: '#FFFFFF',
    cards: [
      { name: 'MAAS Aviation', location: 'Maastricht, NL' },
      { name: 'IAC Painting', location: 'Shannon, Ireland' },
      { name: 'Satys Aerospace', location: 'Toulouse, France' },
      { name: 'Bombardier Paint', location: 'Montreal, Canada' },
    ],
  },
  {
    title: 'Engine MRO', bg: BG_LIGHT,
    cards: [
      { name: 'GE Aviation', location: 'Cincinnati, USA' },
      { name: 'Rolls-Royce MRO', location: 'Derby, UK' },
      { name: 'MTU Aero Engines', location: 'Munich, Germany' },
      { name: 'Pratt & Whitney', location: 'East Hartford, USA' },
    ],
  },
  {
    title: 'APU Services', bg: '#FFFFFF',
    cards: [
      { name: 'Honeywell Aerospace', location: 'Phoenix, USA' },
      { name: 'StandardAero', location: 'Scottsdale, USA' },
      { name: 'Safran Power', location: 'Brussels, Belgium' },
      { name: 'Chromalloy', location: 'San Antonio, USA' },
    ],
  },
];

export default function HomePage({ onSearch }: { onSearch?: () => void }) {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="flex flex-col items-center gap-8"
        style={{ backgroundColor: NAVY, padding: '80px 120px 60px' }}
      >
        <h1
          className="text-center font-extrabold m-0"
          style={{ color: '#FFFFFF', fontSize: 56, lineHeight: 1.15, maxWidth: 900 }}
        >
          Secure MRO Slots in Minutes,<br />Not Weeks
        </h1>

        <p
          className="text-center m-0"
          style={{ color: TEXT_MUTED, fontSize: 18, lineHeight: 1.6, maxWidth: 700 }}
        >
          The world's leading aviation maintenance marketplace. Compare, book, and manage MRO
          services across a global network of certified facilities — all in one platform.
        </p>

        <SearchBar onSearch={onSearch} />

        {/* Category icons */}
        <div className="flex gap-5">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="flex flex-col items-center gap-3 cursor-pointer transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '28px 20px', width: 170 }}
            >
              {cat.icon}
              <span
                className="text-[13px] font-medium text-center whitespace-pre-line"
                style={{ color: '#FFFFFF' }}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Immediate Availability */}
      <section className="flex flex-col gap-8" style={{ backgroundColor: '#FFFFFF', padding: '64px 80px' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: GREEN }} />
          <h2 className="text-[32px] font-bold m-0" style={{ color: TEXT_PRIMARY }}>
            Immediate Availability
          </h2>
        </div>
        <div className="flex gap-6">
          {immediateRow1.map((card) => (
            <div key={card.name} className="flex-1"><MROCard {...card} /></div>
          ))}
        </div>
        <div className="flex gap-6">
          {immediateRow2.map((card) => (
            <div key={card.name} className="flex-1"><MROCard {...card} /></div>
          ))}
        </div>
      </section>

      {/* World Map */}
      <section
        className="flex flex-col items-center gap-6"
        style={{ backgroundColor: BG_LIGHT, padding: '64px 80px' }}
      >
        <h2 className="text-[32px] font-bold text-center m-0" style={{ color: TEXT_PRIMARY }}>
          Global MRO Network
        </h2>
        <p className="text-base text-center m-0" style={{ color: TEXT_SECONDARY }}>
          Access certified maintenance facilities across 6 continents
        </p>
        <div
          className="relative overflow-hidden"
          style={{
            width: 1200,
            maxWidth: '100%',
            height: 500,
            borderRadius: 16,
            backgroundImage: 'url(/world-map.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="absolute flex items-center gap-1.5 px-4 py-2"
            style={{ top: 24, left: 40, backgroundColor: GREEN, borderRadius: 20 }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} />
            <span className="text-[13px] font-semibold text-white">142 Facilities Available Now</span>
          </div>
        </div>
      </section>

      {/* Category sections */}
      {categorySections.map(({ title, bg, cards }) => (
        <section
          key={title}
          className="flex flex-col gap-6"
          style={{ backgroundColor: bg, padding: '48px 80px' }}
        >
          <h2 className="text-2xl font-bold m-0" style={{ color: TEXT_PRIMARY }}>{title}</h2>
          <div className="flex gap-4">
            {cards.map((card) => (
              <div key={card.name} className="flex-1">
                <MROCardHorizontal name={card.name} location={card.location} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
