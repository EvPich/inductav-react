import { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  BadgeCheck,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Building2,
  Users,
  Newspaper,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const TEAL_LIGHT = '#EDF7F4';
const GREEN = '#22C55E';

const stats = [
  { value: '35+', label: 'Years Experience' },
  { value: '1,200+', label: 'Completed Jobs' },
  { value: '150+', label: 'Current Clients' },
  { value: '48h', label: 'Avg. Response Time' },
];

const services = [
  ['C-Check', 'D-Check', 'A-Check'],
  ['Line Maintenance', 'Cabin Modification', 'Avionics'],
  ['Engine Removal', 'AOG Support', 'CAMO Services'],
];

const certifications = ['EASA Part 145', 'FAA Repair Station', 'ISO 9001:2015', 'AS/EN 9110', 'TCCA Approved'];

const aircraftTags = ['A320 Family', 'B737', 'B767', 'B777', 'A330', 'ATR 42/72'];

const newsletterItems = [
  {
    date: 'Apr 2026',
    title: 'MRO Europe 2026 Participation',
    body: 'Lufthansa Technik Shannon will be exhibiting at MRO Europe 2026 in Amsterdam. Visit us at stand B42 to discuss your upcoming maintenance requirements.',
  },
  {
    date: 'Mar 2026',
    title: 'New A350 XWB Capability Certified',
    body: 'We are pleased to announce EASA certification for A350 XWB heavy maintenance, expanding our wide-body offering to include this next-generation platform.',
  },
  {
    date: 'Feb 2026',
    title: 'Hangar 4 Expansion Complete',
    body: 'Our new wide-body bay expansion is now operational, adding two additional A330/B777 positions and increasing capacity by 30%.',
  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type SlotStatus = 'available' | 'booked';

function getCalendarWeeks(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (firstDay + 6) % 7;
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function getISOWeek(year: number, month: number, day: number): number {
  const d = new Date(Date.UTC(year, month - 1, day));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayStatus(year: number, month: number, day: number): SlotStatus {
  const hash = (year * 100 + month) * 31 + day;
  return hash % 3 === 0 ? 'booked' : 'available';
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const slotColor: Record<SlotStatus, { bg: string; text: string }> = {
  available: { bg: '#F0FDF4', text: '#16A34A' },
  booked: { bg: '#FEF2F2', text: '#EF4444' },
};

const serviceOptions = ['Base Maintenance', 'C-Check', 'D-Check', 'A-Check', 'Line Maintenance', 'Cabin Modification', 'Avionics'];
const aircraftOptions = ['Boeing 737-800', 'Airbus A320', 'Airbus A330', 'Boeing 757', 'Embraer E-Jet', 'ATR 72'];
const calAircraftOptions = ['Any Aircraft', ...aircraftOptions];
const calServiceOptions = ['Any Service', ...serviceOptions];

type OpenField = 'service' | 'aircraft' | 'earliest' | 'latest' | null;

export default function MROProfilePage({ onHome, onRequestSlot, onSearchResults }: { onHome?: () => void; onRequestSlot?: () => void; onSearchResults?: () => void }) {
  const [serviceType, setServiceType] = useState('Base Maintenance');
  const [aircraftType, setAircraftType] = useState('Boeing 737-800');
  const [openField, setOpenField] = useState<OpenField>(null);
  const [msn, setMsn] = useState('');
  const [registration, setRegistration] = useState('');
  const [operator, setOperator] = useState('');
  const [multipleAircraft, setMultipleAircraft] = useState(false);
  const [counterPropose, setCounterPropose] = useState(false);
  const [scopeNotes, setScopeNotes] = useState('');
  const [earliestDay, setEarliestDay] = useState<number | null>(null);
  const [latestDay, setLatestDay] = useState<number | null>(null);

  // Calendar state — start April 2026, max 24 months forward
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4);
  const [calAircraft, setCalAircraft] = useState('Any Aircraft');
  const [calService, setCalService] = useState('Any Service');

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

  const calWeeks = getCalendarWeeks(calYear, calMonth);

  const canNavBack = !(calYear === 2026 && calMonth === 4);
  const canNavForward = !(calYear === 2028 && calMonth === 4);

  function navMonth(dir: 1 | -1) {
    let m = calMonth + dir;
    let y = calYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setCalMonth(m);
    setCalYear(y);
  }

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

  function buildDateLabel(day: number | null) {
    if (!day) return 'Select date';
    return `${day} ${MONTH_NAMES[calMonth - 1].slice(0, 3)} 2026`;
  }

  // Build date dropdown calendar (April 2026 for the slot request form)
  const formWeeks = getCalendarWeeks(2026, 4);
  const formDayStatus: Record<number, SlotStatus> = {};
  for (let d = 1; d <= 30; d++) formDayStatus[d] = getDayStatus(2026, 4, d);

  function renderDateDropdown(_field: 'earliest' | 'latest', value: number | null, setValue: (v: number) => void) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-20 p-3 flex flex-col gap-2" style={{ border: '1px solid #E2E8F0' }}>
        <div className="flex items-center justify-between">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100"><ChevronLeft size={15} className="text-slate-500" /></button>
          <span className="text-sm font-semibold text-slate-800">April 2026</span>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100"><ChevronRight size={15} className="text-slate-500" /></button>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-0.5">{d.slice(0, 1)}</div>
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          {formWeeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-0.5">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="h-7" />;
                const isSelected = day === value;
                const status = formDayStatus[day];
                const { bg, text } = slotColor[status];
                return (
                  <button
                    key={di}
                    disabled={status === 'booked'}
                    onClick={() => { setValue(day); setOpenField(null); }}
                    className="h-7 flex items-center justify-center rounded text-[11px] font-medium"
                    style={isSelected ? { backgroundColor: TEAL, color: '#FFFFFF' } : { backgroundColor: bg, color: text }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onHome={onHome} />

      {/* Breadcrumb */}
      <div className="hidden md:flex max-w-[1360px] mx-auto px-4 md:px-8 lg:px-10 h-12 items-center gap-2 text-[13px]">
        <a href="#" className="font-medium hover:underline" style={{ color: TEAL }}>Home</a>
        <span className="text-slate-400">/</span>
        <button onClick={onSearchResults} className="font-medium hover:underline" style={{ color: TEAL }}>Search Results</button>
        <span className="text-slate-400">/</span>
        <span className="font-medium text-slate-700">Lufthansa Technik Shannon</span>
      </div>

      {/* Hero — no verified badge, no rating */}
      <div className="relative w-full h-[220px] md:h-[340px] overflow-hidden" style={{ backgroundImage: 'url(/lufthansa-technik.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative z-10 max-w-[1360px] mx-auto px-4 md:px-8 lg:px-10 h-full flex items-end justify-between gap-4">
          <div className="flex flex-col gap-3 pb-8">
            <h1 className="text-[32px] font-bold text-white">Lufthansa Technik Shannon</h1>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-sm text-slate-300">Shannon, Co. Clare, Ireland</span>
            </div>
          </div>

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

      {/* Mobile action row */}
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
        <button className="w-11 h-11 flex items-center justify-center border border-slate-200 rounded-xl bg-white hover:border-slate-300">
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
                <div key={i} className="flex flex-wrap gap-3">
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

          {/* Hangar & Workforce */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-xl font-bold text-slate-900">Hangar &amp; Workforce</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Building2 size={18} style={{ color: TEAL }} />
                  <span className="text-sm font-semibold text-slate-800">Hangar Capacity</span>
                </div>
                <ul className="flex flex-col gap-2 pl-1">
                  {[
                    '4 wide-body bays (A330 / B777 / B767)',
                    '8 narrow-body positions (A320 / B737)',
                    '2 dedicated engine run-up bays',
                    '6,500 m² total hangar floor space',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: TEAL }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Users size={18} style={{ color: TEAL }} />
                  <span className="text-sm font-semibold text-slate-800">Workforce</span>
                </div>
                <ul className="flex flex-col gap-2 pl-1">
                  {[
                    '850+ licensed aircraft engineers',
                    '320 AMEs (EASA Part 66 Cat B)',
                    '24/7 shift coverage, 365 days',
                    'Multilingual technical support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: TEAL }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Availability Calendar */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Slot Availability</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => canNavBack && navMonth(-1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-30"
                  disabled={!canNavBack}
                >
                  <ChevronLeft size={16} className="text-slate-600" />
                </button>
                <span className="text-sm font-medium text-slate-700 w-32 text-center">
                  {MONTH_NAMES[calMonth - 1]} {calYear}
                </span>
                <button
                  onClick={() => canNavForward && navMonth(1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-30"
                  disabled={!canNavForward}
                >
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>
            </div>

            {/* Calendar grid: week# column + 7 day columns */}
            <div className="grid gap-1" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
              {/* Header row */}
              <div className="text-center text-[10px] font-semibold text-slate-400 py-1">Wk</div>
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-slate-500 py-1">{d}</div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {calWeeks.map((week, wi) => {
                const firstDay = week.find((d) => d !== null);
                const weekNum = firstDay ? getISOWeek(calYear, calMonth, firstDay) : null;
                return (
                  <div key={wi} className="grid gap-1 h-10" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
                    {/* Week number cell */}
                    <div className="flex items-center justify-center text-[10px] font-semibold text-slate-400">
                      {weekNum ? `W${weekNum}` : ''}
                    </div>
                    {week.map((day, di) => {
                      if (day === null) return <div key={di} />;
                      const status = getDayStatus(calYear, calMonth, day);
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
                );
              })}
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-500">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-xs text-slate-500">Fully Booked</span>
              </div>
            </div>

            {/* Selection criteria */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter Availability By</span>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                  <label className="text-[11px] font-medium text-slate-500">Aircraft Type</label>
                  <select
                    value={calAircraft}
                    onChange={(e) => setCalAircraft(e.target.value)}
                    className="h-9 px-3 text-xs rounded-lg outline-none bg-slate-50"
                    style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
                  >
                    {calAircraftOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                  <label className="text-[11px] font-medium text-slate-500">Service Type</label>
                  <select
                    value={calService}
                    onChange={(e) => setCalService(e.target.value)}
                    className="h-9 px-3 text-xs rounded-lg outline-none bg-slate-50"
                    style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
                  >
                    {calServiceOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter (replaces Reviews) */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Newspaper size={20} style={{ color: TEAL }} />
              <h2 className="text-xl font-bold text-slate-900">Latest News &amp; Updates</h2>
            </div>
            <div className="flex flex-col gap-4">
              {newsletterItems.map((item) => (
                <div key={item.title} className="flex flex-col gap-1.5 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: TEAL_LIGHT, color: TEAL }}>{item.date}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                placeholder="Your email address"
                className="flex-1 h-10 px-3 text-sm bg-slate-50 rounded-lg outline-none"
                style={{ border: '1px solid #E2E8F0', color: '#1E293B' }}
              />
              <button
                className="h-10 px-4 text-sm font-semibold text-white rounded-lg transition-colors shrink-0"
                style={{ backgroundColor: TEAL }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
              >
                Subscribe
              </button>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5">

          {/* Request a Slot — sticky with internal scroll */}
          <div
            ref={slotRef}
            className="bg-white rounded-2xl shadow-sm lg:sticky lg:top-20 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 90px)' }}
          >
            <div className="overflow-y-auto h-full p-6 flex flex-col gap-4">
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
                          style={{ color: serviceType === opt ? TEAL : '#1E293B', backgroundColor: serviceType === opt ? TEAL_LIGHT : 'transparent' }}
                        >
                          {opt}
                          {serviceType === opt && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke={TEAL} strokeWidth="2" strokeLinecap="round" /></svg>}
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
                          style={{ color: aircraftType === opt ? TEAL : '#1E293B', backgroundColor: aircraftType === opt ? TEAL_LIGHT : 'transparent' }}
                        >
                          {opt}
                          {aircraftType === opt && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke={TEAL} strokeWidth="2" strokeLinecap="round" /></svg>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Aircraft Details */}
              <div className="flex flex-col gap-3">
                <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Aircraft Details</span>

                {/* Multiple aircraft toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[13px] text-slate-700 font-medium">Multiple-aircraft request</span>
                  <button
                    onClick={() => setMultipleAircraft(!multipleAircraft)}
                    className="flex items-center p-0.5 rounded-full transition-colors shrink-0"
                    style={{ width: 38, height: 20, backgroundColor: multipleAircraft ? TEAL : '#CBD5E1', justifyContent: multipleAircraft ? 'flex-end' : 'flex-start' }}
                  >
                    <span className="w-4 h-4 rounded-full bg-white block" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                </label>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">MSN <span style={{ color: '#EF4444' }}>*</span></label>
                  <input
                    value={msn}
                    onChange={(e) => setMsn(e.target.value)}
                    placeholder="e.g. 28658"
                    disabled={multipleAircraft}
                    className="h-10 px-3 text-sm rounded-lg outline-none disabled:opacity-40"
                    style={{ border: '1px solid #E2E8F0', backgroundColor: '#F5F7FA', color: '#1E293B' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">Current Registration <span style={{ color: '#EF4444' }}>*</span></label>
                  <input
                    value={registration}
                    onChange={(e) => setRegistration(e.target.value)}
                    placeholder="e.g. EI-FRG"
                    disabled={multipleAircraft}
                    className="h-10 px-3 text-sm rounded-lg outline-none disabled:opacity-40"
                    style={{ border: '1px solid #E2E8F0', backgroundColor: '#F5F7FA', color: '#1E293B' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">Operator <span style={{ color: '#EF4444' }}>*</span></label>
                  <input
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    placeholder="e.g. Ryanair"
                    className="h-10 px-3 text-sm rounded-lg outline-none"
                    style={{ border: '1px solid #E2E8F0', backgroundColor: '#F5F7FA', color: '#1E293B' }}
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Dates */}
              <div className="flex flex-col gap-3">
                <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Induction Window</span>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">Earliest Induction <span style={{ color: '#EF4444' }}>*</span></label>
                  <div className="relative">
                    <button style={triggerStyle('earliest')} onClick={() => toggleField('earliest')}>
                      <span className="text-sm" style={{ color: '#1E293B' }}>{buildDateLabel(earliestDay)}</span>
                      <Calendar size={16} color="#94A3B8" />
                    </button>
                    {openField === 'earliest' && renderDateDropdown('earliest', earliestDay, setEarliestDay)}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">Latest Acceptable <span style={{ color: '#EF4444' }}>*</span></label>
                  <div className="relative">
                    <button style={triggerStyle('latest')} onClick={() => toggleField('latest')}>
                      <span className="text-sm" style={{ color: '#1E293B' }}>{buildDateLabel(latestDay)}</span>
                      <Calendar size={16} color="#94A3B8" />
                    </button>
                    {openField === 'latest' && renderDateDropdown('latest', latestDay, setLatestDay)}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setCounterPropose(!counterPropose)}
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                    style={{ backgroundColor: counterPropose ? TEAL : '#FFFFFF', border: `2px solid ${counterPropose ? TEAL : '#CBD5E1'}` }}
                  >
                    {counterPropose && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                  </div>
                  <span className="text-[13px] text-slate-600">Allow MRO to counter-propose dates</span>
                </label>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Scope notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500">Additional Scope Notes</label>
                <textarea
                  value={scopeNotes}
                  onChange={(e) => setScopeNotes(e.target.value)}
                  placeholder="Describe any additional work scope, special requirements, or known defects..."
                  rows={3}
                  className="px-3 py-2.5 text-sm rounded-lg outline-none resize-none"
                  style={{ border: '1px solid #E2E8F0', backgroundColor: '#F5F7FA', color: '#1E293B' }}
                />
              </div>

              {/* CTA */}
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
