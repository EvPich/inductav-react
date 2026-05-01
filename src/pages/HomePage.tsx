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
  { name: 'Lufthansa Technik', location: 'Hamburg, Germany', serviceType: 'General MRO', available: true, imageUrl: '/lufthansa-technik.jpg' },
  { name: 'ST Aerospace', location: 'Singapore', serviceType: 'Engine MRO', available: true, imageUrl: '/st-engineering.jpg' },
  { name: 'HAECO', location: 'Hong Kong, China', serviceType: 'Components', available: true, imageUrl: '/haeco.jpg' },
];

const immediateRow2 = [
  { name: 'AAR Corp', location: 'Miami, USA', serviceType: 'Landing Gear', available: false, imageUrl: '/aar-corp.jpg' },
  { name: 'Turkish Technic', location: 'Istanbul, Turkey', serviceType: 'Painting', available: true, imageUrl: '/turkish-technic.jpg' },
  { name: 'Iberia Maintenance', location: 'Madrid, Spain', serviceType: 'APU Services', available: false, imageUrl: '/iberia.jpg' },
];

type CategorySection = { title: string; bg: string; cards: { name: string; location: string; imageUrl?: string }[] };

const categorySections: CategorySection[] = [
  {
    title: 'General MRO', bg: '#FFFFFF',
    cards: [
      { name: 'Lufthansa Technik', location: 'Hamburg, Germany', imageUrl: '/lufthansa-technik.jpg' },
      { name: 'Ameco Beijing', location: 'Beijing, China', imageUrl: '/ameco-beijing.jpg' },
      { name: 'GAMECO', location: 'Guangzhou, China', imageUrl: '/gameco.jpg' },
      { name: 'SIA Engineering', location: 'Singapore', imageUrl: '/sia-engineering.jpg' },
    ],
  },
  {
    title: 'Landing Gear Shop', bg: BG_LIGHT,
    cards: [
      { name: 'Safran Landing', location: 'Gloucester, UK', imageUrl: '/safran-landing.jpg' },
      { name: 'Liebherr Aerospace', location: 'Lindenberg, Germany', imageUrl: '/liebherr-aerospace.jpg' },
      { name: 'Triumph Group', location: 'Cleveland, USA', imageUrl: '/triumph-group.png' },
      { name: 'Messier-Bugatti', location: 'Vélizy, France', imageUrl: '/messier-bugatti.jpg' },
    ],
  },
  {
    title: 'Painting', bg: '#FFFFFF',
    cards: [
      { name: 'MAAS Aviation', location: 'Maastricht, NL', imageUrl: '/maas-aviation.jpg' },
      { name: 'IAC Painting', location: 'Shannon, Ireland', imageUrl: '/iac-painting.jpg' },
      { name: 'Satys Aerospace', location: 'Toulouse, France', imageUrl: '/satys-aerospace.jpg' },
      { name: 'Bombardier Paint', location: 'Montreal, Canada', imageUrl: '/bombardier-paint.jpg' },
    ],
  },
  {
    title: 'Engine MRO', bg: BG_LIGHT,
    cards: [
      { name: 'GE Aviation', location: 'Cincinnati, USA', imageUrl: '/ge-aviation.jpg' },
      { name: 'Rolls-Royce MRO', location: 'Derby, UK', imageUrl: '/rolls-royce-mro.jpg' },
      { name: 'MTU Aero Engines', location: 'Munich, Germany', imageUrl: '/mtu-aero-engines.jpg' },
      { name: 'Pratt & Whitney', location: 'East Hartford, USA', imageUrl: '/pratt-whitney.jpg' },
    ],
  },
  {
    title: 'APU Services', bg: '#FFFFFF',
    cards: [
      { name: 'Honeywell Aerospace', location: 'Phoenix, USA', imageUrl: '/honeywell-aerospace.jpg' },
      { name: 'StandardAero', location: 'Scottsdale, USA', imageUrl: '/standardaero.jpg' },
      { name: 'Safran Power', location: 'Brussels, Belgium', imageUrl: '/safran-power.jpg' },
      { name: 'Chromalloy', location: 'San Antonio, USA', imageUrl: '/chromalloy.jpg' },
    ],
  },
  {
    title: 'Parking & Storage', bg: BG_LIGHT,
    cards: [
      { name: 'Mojave Air & Space Port', location: 'Mojave, USA', imageUrl: '/mojave.jpg' },
      { name: 'Teruel Airport Storage', location: 'Teruel, Spain', imageUrl: '/teruel.jpg' },
      { name: 'Alice Springs Aircraft Storage', location: 'Alice Springs, Australia', imageUrl: '/alice-springs.jpg' },
      { name: 'Marana Pinal Airpark', location: 'Marana, USA', imageUrl: '/marana.jpg' },
    ],
  },
];

export default function HomePage({ onSearch, onHome, onViewProfile }: { onSearch?: () => void; onHome?: () => void; onViewProfile?: () => void }) {
  return (
    <div className="min-h-screen">
      <Navbar onHome={onHome} />

      {/* Hero */}
      <section
        className="relative flex flex-col items-center gap-6 md:gap-8 px-6 md:px-16 lg:px-[120px] pt-10 pb-8 md:pt-16 md:pb-12 lg:pt-[80px] lg:pb-[60px]"
        style={{
          backgroundColor: NAVY,
          backgroundImage: 'url(/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 43, 74, 0.72)' }} />
        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 w-full">
        <h1
          className="text-center font-extrabold m-0 text-3xl md:text-4xl lg:text-5xl xl:text-[56px]"
          style={{ color: '#FFFFFF', lineHeight: 1.15, maxWidth: 900 }}
        >
          Secure MRO Slots in Minutes,<br />Not Weeks
        </h1>

        <p
          className="text-center m-0 text-sm md:text-base lg:text-[18px]"
          style={{ color: TEXT_MUTED, lineHeight: 1.6, maxWidth: 700 }}
        >
          The world's leading aviation maintenance marketplace. Compare, book, and manage MRO
          services across a global network of certified facilities — all in one platform.
        </p>

        <SearchBar onSearch={onSearch} />

        {/* Category icons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 md:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="flex flex-col items-center gap-3 cursor-pointer transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 12px', minWidth: 120 }}
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
        </div>{/* end z-10 content wrapper */}
      </section>

      {/* Immediate Availability */}
      <section className="flex flex-col gap-6 md:gap-8 px-6 md:px-12 lg:px-20 py-10 md:py-12 lg:py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: GREEN }} />
          <h2 className="text-2xl md:text-[32px] font-bold m-0" style={{ color: TEXT_PRIMARY }}>
            Immediate Availability
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...immediateRow1, ...immediateRow2].map((card) => (
            <MROCard key={card.name} {...card} onViewProfile={onViewProfile} />
          ))}
        </div>
      </section>

      {/* World Map */}
      <section
        className="flex flex-col items-center gap-4 md:gap-6 px-6 md:px-12 lg:px-20 py-10 md:py-16"
        style={{ backgroundColor: BG_LIGHT }}
      >
        <h2 className="text-2xl md:text-[32px] font-bold text-center m-0" style={{ color: TEXT_PRIMARY }}>
          Global MRO Network
        </h2>
        <p className="text-base text-center m-0" style={{ color: TEXT_SECONDARY }}>
          Access certified maintenance facilities across 6 continents
        </p>
        <div
          className="relative overflow-hidden w-full"
          style={{
            maxWidth: 1200,
            height: 300,
            borderRadius: 16,
            backgroundImage: 'url(/world-map.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="absolute flex items-center gap-1.5 px-4 py-2"
            style={{ top: 24, left: 24, backgroundColor: GREEN, borderRadius: 20 }}
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
          className="flex flex-col gap-4 md:gap-6 px-6 md:px-12 lg:px-20 py-8 md:py-12"
          style={{ backgroundColor: bg }}
        >
          <h2 className="text-xl md:text-2xl font-bold m-0" style={{ color: TEXT_PRIMARY }}>{title}</h2>
          <div className="flex gap-3 pb-2 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
            {cards.map((card) => (
              <div key={card.name} className="shrink-0 w-[240px] md:w-auto">
                <MROCardHorizontal name={card.name} location={card.location} imageUrl={card.imageUrl} onViewProfile={onViewProfile} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
