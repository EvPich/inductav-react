import { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Star,
  BadgeCheck,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const TEAL_LIGHT = '#EDF7F4';
const NAVY = '#1C2B4A';
const GREEN = '#22C55E';

const stats = [
  { value: '35+', label: 'Years Experience' },
  { value: '1,200+', label: 'Completed Jobs' },
  { value: '4.8', label: 'Average Rating' },
  { value: '48h', label: 'Avg. Response Time' },
];

const services = [
  ['C-Check', 'D-Check', 'A-Check'],
  ['Line Maintenance', 'Cabin Modification', 'Avionics'],
  ['Engine Removal', 'AOG Support', 'CAMO Services'],
];

const certifications = ['EASA Part 145', 'FAA Repair Station', 'ISO 9001:2015', 'AS/EN 9110', 'TCCA Approved'];

const aircraftTags = ['A320 Family', 'B737', 'B767', 'B777', 'A330', 'ATR 42/72'];

const reviews = [
  {
    author: "James O'Brien",
    role: 'Director of Maintenance, Ryanair',
    rating: 5,
    text: 'Exceptional quality of work on our 737-800 C-check. The team completed the work 3 days ahead of schedule with zero punch items.',
  },
  {
    author: 'Maria Santos',
    role: 'Fleet Technical Manager, TAP Air Portugal',
    rating: 4,
    text: 'Great facility with skilled engineers. The cabin modification project was delivered on time and within budget.',
  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type SlotStatus = 'available' | 'booked' | 'partial';

// April 2026: starts Wednesday (Mon-index = 2)
// null = padding cell outside month
const aprilWeeks: (number | null)[][] = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, null, null, null],
];

const dayStatus: Record<number, SlotStatus> = {
  1: 'available', 2: 'available', 3: 'booked', 4: 'available', 5: 'partial',
  6: 'booked', 7: 'available', 8: 'available', 9: 'booked', 10: 'available',
  11: 'available', 12: 'booked', 13: 'available', 14: 'partial', 15: 'available',
  16: 'available', 17: 'booked', 18: 'available', 19: 'booked', 20: 'available',
  21: 'available', 22: 'partial', 23: 'available', 24: 'available', 25: 'booked',
  26: 'partial', 27: 'available', 28: 'available', 29: 'available', 30: 'booked',
};

const slotColor: Record<SlotStatus, { bg: string; text: string }> = {
  available: { bg: '#F0FDF4', text: '#16A34A' },
  booked: { bg: '#FEF2F2', text: '#EF4444' },
  partial: { bg: '#FFFBEB', text: '#D97706' },
};

const serviceOptions = ['Base Maintenance', 'C-Check', 'D-Check', 'A-Check', 'Line Maintenance', 'Cabin Modification', 'Avionics'];
const aircraftOptions = ['Boeing 737-800', 'Airbus A320', 'Airbus A330', 'Boeing 757', 'Embraer E-Jet', 'ATR 72'];

type OpenField = 'service' | 'aircraft' | 'date' | null;

export default function MROProfilePage({ onHome, onRequestSlot, onSearchResults }: { onHome?: () => void; onRequestSlot?: () => void; onSearchResults?: () => void }) {
  const [serviceType, setServiceType] = useState('Base Maintenance');
  const [aircraftType, setAircraftType] = useState('Boeing 737-800');
  const [selectedDay, setSelectedDay] = useState<number | null>(9);
  const [openField, setOpenField] = useState<OpenField>(null);

  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (slotRef.current && !slotRef.current.contains(e.target as Node)) {
        setOpenField(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dateLabel = selectedDay ? `${selectedDay} Apr 2026` : 'Select date';

  const toggleField = (field: OpenField) =>
    setOpenField((prev) => (prev === field ? null : field));

  const triggerStyle = (field: OpenField) => ({
    backgroundColor: '#F5F7FA',
    border: `1px solid ${openField === field ? TEAL : '#E2E8F0'}`,
    borderRadius: 8,
    height: 42,
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between' as const,
    width: '100%',
    cursor: 'pointer',
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onHome={onHome} />

      {/* Breadcrumb — hidden on mobile */}
      <div className="hidden md:flex max-w-[1360px] mx-auto px-4 md:px-8 lg:px-10 h-12 items-center gap-2 text-[13px]">
        <a href="#" className="font-medium hover:underline" style={{ color: TEAL }}>Home</a>
        <span className="text-slate-400">/</span>
        <button onClick={onSearchResults} className="font-medium hover:underline" style={{ color: TEAL }}>Search Results</button>
        <span className="text-slate-400">/</span>
        <span className="font-medium text-slate-700">Lufthansa Technik Shannon</span>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[220px] md:h-[340px] overflow-hidden" style={{ backgroundImage: 'url(/lufthansa-technik.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative z-10 max-w-[1360px] mx-auto px-4 md:px-8 lg:px-10 h-full flex items-end justify-between gap-4">
          {/* Info */}
          <div className="flex flex-col gap-3 pb-8">
            <span
              className="self-start flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: GREEN }}
            >
              <BadgeCheck size={12} />
              Verified MRO
            </span>
            <h1 className="text-[32px] font-bold text-white">Lufthansa Technik Shannon</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm text-slate-300">Shannon, Co. Clare, Ireland</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm text-slate-300 ml-1">4.8 (127 reviews)</span>
              </div>
            </div>
          </div>

          {/* Hero CTA — hidden on mobile */}
          <div className="hidden md:block pb-8">
            <button
              onClick={onRequestSlot}
              className="flex items-center gap-2 px-7 h-11 text-white text-[15px] font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: TEAL }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <MessageCircle size={18} />
              Request Slot &amp; Chat
            </button>
          </div>
        </div>
      </div>

      {/* Mobile action row — below hero, hidden on md+ */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
        <button
          onClick={onRequestSlot}
          className="flex-1 flex items-center justify-center gap-2 h-11 text-white text-sm font-semibold rounded-xl transition-colors"
          style={{ backgroundColor: TEAL }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
        >
          <MessageCircle size={16} />
          Request Slot &amp; Chat
        </button>
        <button
          className="w-11 h-11 flex items-center justify-center border border-slate-200 rounded-xl bg-white transition-colors hover:border-slate-300"
        >
          <Phone size={18} style={{ color: TEAL }} />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Overview */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-xl font-bold text-slate-900">Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lufthansa Technik Shannon is one of Europe's leading MRO providers, specialising in
              heavy maintenance for narrow-body and wide-body aircraft. Located at Shannon Airport,
              we offer comprehensive C-check and D-check capabilities alongside line maintenance and
              cabin modification services.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 bg-slate-50 rounded-xl p-4">
                  <span className="text-2xl font-bold" style={{ color: TEAL }}>{s.value}</span>
                  <span className="text-xs text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900">Services Offered</h2>
            <div className="flex flex-col gap-3">
              {services.map((row, i) => (
                <div key={i} className="flex gap-3">
                  {row.map((svc) => (
                    <span
                      key={svc}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg"
                      style={{ backgroundColor: TEAL_LIGHT, color: TEAL }}
                    >
                      <BadgeCheck size={13} />
                      {svc}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Availability Calendar */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Slot Availability</h2>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronLeft size={16} className="text-slate-600" />
                </button>
                <span className="text-sm font-medium text-slate-700">April 2026</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-slate-500 py-1">{d}</div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {aprilWeeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1 h-10">
                  {week.map((day, di) => {
                    if (day === null) return <div key={di} />;
                    const status = dayStatus[day];
                    const { bg, text } = slotColor[status];
                    return (
                      <button
                        key={di}
                        className="flex items-center justify-center rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                        style={{ backgroundColor: bg, color: text }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-500">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs text-slate-500">Partially Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-xs text-slate-500">Fully Booked</span>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-slate-800">4.8</span>
                  <span className="text-sm text-slate-500">(127)</span>
                </div>
              </div>
              <button className="text-sm font-semibold hover:underline" style={{ color: TEAL }}>See All</button>
            </div>
            {reviews.map((rev) => (
              <div key={rev.author} className="flex flex-col gap-2 pb-4 border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-900">{rev.author}</span>
                    <p className="text-xs text-slate-500">{rev.role}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5">
          {/* Quick Book */}
          <div ref={slotRef} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 lg:sticky lg:top-4">
            <h2 className="text-[18px] font-bold text-slate-900">Request a Slot</h2>

            {/* Service Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">Service Type</label>
              <div className="relative">
                <button style={triggerStyle('service')} onClick={() => toggleField('service')}>
                  <span className="text-sm" style={{ color: '#1E293B' }}>{serviceType}</span>
                  <ChevronDown size={16} color="#94A3B8" />
                </button>
                {openField === 'service' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-20 overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                    {serviceOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setServiceType(opt); setOpenField(null); }}
                        className="w-full px-3 py-2.5 text-left text-sm flex items-center justify-between transition-colors hover:bg-slate-50"
                        style={{
                          color: serviceType === opt ? TEAL : '#1E293B',
                          backgroundColor: serviceType === opt ? TEAL_LIGHT : 'transparent',
                        }}
                      >
                        {opt}
                        {serviceType === opt && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5L4.5 8.5L11 1" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Aircraft Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">Aircraft Type</label>
              <div className="relative">
                <button style={triggerStyle('aircraft')} onClick={() => toggleField('aircraft')}>
                  <span className="text-sm" style={{ color: '#1E293B' }}>{aircraftType}</span>
                  <ChevronDown size={16} color="#94A3B8" />
                </button>
                {openField === 'aircraft' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-20 overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                    {aircraftOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setAircraftType(opt); setOpenField(null); }}
                        className="w-full px-3 py-2.5 text-left text-sm flex items-center justify-between transition-colors hover:bg-slate-50"
                        style={{
                          color: aircraftType === opt ? TEAL : '#1E293B',
                          backgroundColor: aircraftType === opt ? TEAL_LIGHT : 'transparent',
                        }}
                      >
                        {opt}
                        {aircraftType === opt && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5L4.5 8.5L11 1" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preferred Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">Preferred Date</label>
              <div className="relative">
                <button style={triggerStyle('date')} onClick={() => toggleField('date')}>
                  <span className="text-sm" style={{ color: '#1E293B' }}>{dateLabel}</span>
                  <Calendar size={16} color="#94A3B8" />
                </button>
                {openField === 'date' && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-20 p-4 flex flex-col gap-3"
                    style={{ border: '1px solid #E2E8F0' }}
                  >
                    {/* Month nav */}
                    <div className="flex items-center justify-between">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                        <ChevronLeft size={15} className="text-slate-500" />
                      </button>
                      <span className="text-sm font-semibold text-slate-800">April 2026</span>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                        <ChevronRight size={15} className="text-slate-500" />
                      </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {DAYS.map((d) => (
                        <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-0.5">{d}</div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="flex flex-col gap-0.5">
                      {aprilWeeks.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 gap-0.5">
                          {week.map((day, di) => {
                            if (day === null) return <div key={di} className="h-8" />;
                            const isSelected = day === selectedDay;
                            const status = dayStatus[day];
                            const { bg, text } = slotColor[status];
                            return (
                              <button
                                key={di}
                                onClick={() => { setSelectedDay(day); setOpenField(null); }}
                                className="h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all"
                                style={
                                  isSelected
                                    ? { backgroundColor: TEAL, color: '#FFFFFF', border: `2px solid ${TEAL}` }
                                    : { backgroundColor: bg, color: text }
                                }
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-slate-400">Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[10px] text-slate-400">Partial</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-[10px] text-slate-400">Booked</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onRequestSlot}
                className="w-full h-[46px] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: TEAL }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
              >
                <MessageCircle size={16} />
                Request Slot &amp; Chat
              </button>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GREEN }} />
                <span className="text-xs text-slate-500">Online · Replies in ~15 min</span>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: NAVY }}
              >
                LT
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-slate-800">Lufthansa Technik Shannon</span>
                <span className="text-[11px] text-slate-500">Chat to discuss slot details, pricing &amp; logistics</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-900">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-2">
                <BadgeCheck size={18} style={{ color: GREEN }} className="shrink-0" />
                <span className="text-sm font-medium text-slate-800">{cert}</span>
              </div>
            ))}
          </div>

          {/* Supported Aircraft */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-900">Supported Aircraft</h2>
            <div className="flex flex-wrap gap-2">
              {aircraftTags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900">Contact &amp; Location</h2>
            <div className="w-full h-[160px] bg-slate-200 rounded-xl flex items-center justify-center text-sm text-slate-500">
              Map Placeholder
            </div>
            {[
              { icon: <MapPin size={16} />, text: 'Shannon Airport, Co. Clare, V14 X085, Ireland' },
              { icon: <Phone size={16} />, text: '+353 61 472 222' },
              { icon: <Mail size={16} />, text: 'bookings@lufthansa-technik.ie' },
              { icon: <Globe size={16} />, text: 'lufthansa-technik.com' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <span className="shrink-0 mt-0.5" style={{ color: TEAL }}>{icon}</span>
                <span className="text-[13px] text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
