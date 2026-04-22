import { useState, useRef, useEffect, ReactNode } from 'react';
import {
  MapPin, Wrench, Plane, Calendar, Search,
  Clock, Globe, ChevronRight, ChevronLeft,
  Cog, Zap, Paintbrush, Battery, Radio, ScanLine, Armchair,
  Check,
} from 'lucide-react';

const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const NAVY = '#1E293B';
const MUTED = '#94A3B8';
const SECONDARY = '#475569';
const BORDER = '#E2E8F0';
const TEAL_BG = '#EDF7F4';
const TEAL_BG2 = '#E0F2ED';
const LIGHT_BG = '#F5F7FA';

// ─── Shared ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 py-1">
      <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.05em' }}>
        {children}
      </span>
    </div>
  );
}

function Chip({ icon, label, onClick }: { icon?: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 h-7 rounded-full text-xs font-medium transition-colors"
      style={{ backgroundColor: LIGHT_BG, color: SECONDARY, fontSize: 12 }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Location Dropdown ───────────────────────────────────────────────────────

const recentSearches = [
  { city: 'Miami, FL', airport: 'Miami International Airport (MIA)', selected: true },
  { city: 'Shannon, Ireland', airport: 'Shannon Airport (SNN)', selected: false },
  { city: 'Zurich, Switzerland', airport: 'Zurich Airport (ZRH)', selected: false },
];

const popularRegions = [
  { name: 'Europe', count: 142 },
  { name: 'North America', count: 98 },
  { name: 'Asia Pacific', count: 76 },
  { name: 'Middle East & Africa', count: 54 },
  { name: 'South America', count: 31 },
];

function LocationDropdown({ onSelect }: { onSelect: (v: string) => void }) {
  const [query, setQuery] = useState('');

  return (
    <div className="flex flex-col" style={{ width: 400, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}>
      {/* Search inside dropdown */}
      <div
        className="flex items-center gap-2 h-12 px-4"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <Search size={16} color={MUTED} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search airports, cities, or countries..."
          className="flex-1 text-[13px] outline-none bg-transparent"
          style={{ color: NAVY }}
        />
      </div>

      {/* Recent */}
      <div className="px-2 pt-3 pb-1">
        <SectionLabel>RECENT SEARCHES</SectionLabel>
        {recentSearches.map((r) => (
          <button
            key={r.city}
            onClick={() => onSelect(r.city)}
            className="w-full flex items-center gap-3 h-11 px-3 rounded-lg text-left transition-colors"
            style={{ backgroundColor: r.selected ? TEAL_BG : 'transparent' }}
          >
            <Clock size={16} color={r.selected ? TEAL : MUTED} />
            <div className="flex flex-col flex-1 gap-0.5">
              <span style={{ fontSize: 14, fontWeight: 500, color: NAVY }}>{r.city}</span>
              <span style={{ fontSize: 11, color: MUTED }}>{r.airport}</span>
            </div>
            {r.selected && <Check size={16} color={TEAL} />}
          </button>
        ))}
      </div>

      <div style={{ height: 1, backgroundColor: BORDER, margin: '4px 0' }} />

      {/* Popular regions */}
      <div className="px-2 py-1">
        <SectionLabel>POPULAR REGIONS</SectionLabel>
        {popularRegions.map((r) => (
          <button
            key={r.name}
            onClick={() => onSelect(r.name)}
            className="w-full flex items-center gap-3 h-11 px-3 rounded-lg text-left transition-colors hover:bg-[#F5F7FA]"
          >
            <Globe size={16} color={MUTED} />
            <div className="flex flex-col flex-1 gap-0.5">
              <span style={{ fontSize: 14, fontWeight: 500, color: NAVY }}>{r.name}</span>
              <span style={{ fontSize: 11, color: MUTED }}>{r.count} MRO facilities</span>
            </div>
            <ChevronRight size={14} color={MUTED} />
          </button>
        ))}
      </div>

      <div style={{ height: 1, backgroundColor: BORDER, margin: '4px 0' }} />

      {/* Quick picks */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.05em' }}>QUICK PICKS</span>
        <div className="flex gap-1.5 flex-wrap">
          {['Nearest to me', 'Top rated', 'Available now'].map((l) => (
            <Chip key={l} icon={<MapPin size={12} />} label={l} onClick={() => onSelect(l)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Service Type Dropdown ───────────────────────────────────────────────────

const services = [
  { label: 'General Maintenance', sub: 'A, B, C & D checks', icon: <Wrench size={18} />, selected: true },
  { label: 'Landing Gear', sub: 'Overhaul & testing', icon: <Cog size={18} /> },
  { label: 'Engine Overhaul', sub: 'CFM56, V2500, CF34', icon: <Zap size={18} /> },
  { label: 'Painting', sub: 'Full livery & touch-up', icon: <Paintbrush size={18} /> },
  { label: 'APU Services', sub: 'Repair & overhaul', icon: <Battery size={18} /> },
  { label: 'Avionics', sub: 'Navigation & comm systems', icon: <Radio size={18} /> },
  { label: 'NDT & Inspections', sub: 'Non-destructive testing', icon: <ScanLine size={18} /> },
  { label: 'Cabin Interior', sub: 'Refurbishment & mods', icon: <Armchair size={18} /> },
];

function ServiceDropdown({ onSelect }: { onSelect: (v: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = services.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ width: 380, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)', padding: 8 }}>
      {/* Search */}
      <div
        className="flex items-center gap-2 h-9 px-3 rounded-lg mb-1"
        style={{ backgroundColor: LIGHT_BG }}
      >
        <Search size={16} color={MUTED} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services..."
          className="flex-1 text-[13px] outline-none bg-transparent"
          style={{ color: NAVY }}
        />
      </div>

      {/* Items */}
      {filtered.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelect(s.label)}
          className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors"
          style={{ backgroundColor: s.selected ? TEAL_BG : 'transparent' }}
        >
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 32, height: 32, backgroundColor: s.selected ? TEAL_BG2 : LIGHT_BG, color: s.selected ? TEAL : SECONDARY }}
          >
            {s.icon}
          </div>
          <div className="flex flex-col flex-1 gap-0.5">
            <span style={{ fontSize: 14, fontWeight: s.selected ? 600 : 500, color: NAVY }}>{s.label}</span>
            <span style={{ fontSize: 12, color: SECONDARY }}>{s.sub}</span>
          </div>
          {s.selected && <Check size={18} color={TEAL} />}
        </button>
      ))}

      <div style={{ height: 1, backgroundColor: BORDER, margin: '6px 0' }} />

      {/* Popular searches */}
      <div className="px-2 pb-2 flex flex-col gap-2">
        <span style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>Popular searches</span>
        <div className="flex gap-1.5 flex-wrap">
          {['C-Check', 'Engine MRO', 'Painting', 'Landing Gear', 'AOG'].map((l) => (
            <Chip key={l} label={l} onClick={() => onSelect(l)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Aircraft Dropdown ───────────────────────────────────────────────────────

const narrowBody = [
  { label: 'Airbus A320 Family', sub: 'A318 · A319 · A320 · A321' },
  { label: 'Boeing 737', sub: '737-700 · 737-800 · 737 MAX', selected: true },
  { label: 'Embraer E-Jet', sub: 'E170 · E175 · E190 · E195' },
  { label: 'Bombardier CRJ', sub: 'CRJ-200 · CRJ-700 · CRJ-900' },
];

const wideBody = [
  { label: 'Airbus A330', sub: 'A330-200 · A330-300 · A330neo' },
  { label: 'Boeing 767', sub: '767-200 · 767-300 · 767-400' },
  { label: 'Boeing 777', sub: '777-200 · 777-300ER · 777X' },
  { label: 'Airbus A350', sub: 'A350-900 · A350-1000' },
];

const turboprop = [
  { label: 'ATR 42/72', sub: 'ATR 42-600 · ATR 72-600' },
  { label: 'Dash 8 / Q400', sub: 'Q100 · Q200 · Q300 · Q400' },
];

function AircraftDropdown({ onSelect }: { onSelect: (v: string) => void }) {
  const [query, setQuery] = useState('');

  function AcRow({ label, sub, selected }: { label: string; sub: string; selected?: boolean }) {
    return (
      <button
        onClick={() => onSelect(label)}
        className="w-full flex items-center gap-3 h-[42px] px-3 rounded-lg text-left transition-colors hover:bg-[#F5F7FA]"
        style={{ backgroundColor: selected ? TEAL_BG : 'transparent' }}
      >
        <Plane size={16} color={selected ? TEAL : MUTED} />
        <div className="flex flex-col flex-1 gap-0.5">
          <span style={{ fontSize: 14, fontWeight: selected ? 600 : 500, color: NAVY }}>{label}</span>
          <span style={{ fontSize: 11, color: MUTED }}>{sub}</span>
        </div>
        {selected && <Check size={16} color={TEAL} />}
      </button>
    );
  }

  return (
    <div style={{ width: 420, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}>
      {/* Search */}
      <div className="flex items-center gap-2 h-12 px-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <Search size={16} color={MUTED} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search aircraft type or manufacturer..."
          className="flex-1 text-[13px] outline-none bg-transparent"
          style={{ color: NAVY }}
        />
      </div>

      <div className="px-2 py-3 flex flex-col gap-1">
        <SectionLabel>NARROW-BODY</SectionLabel>
        {narrowBody.map((r) => <AcRow key={r.label} {...r} />)}
      </div>

      <div style={{ height: 1, backgroundColor: BORDER }} />

      <div className="px-2 py-3 flex flex-col gap-1">
        <SectionLabel>WIDE-BODY</SectionLabel>
        {wideBody.map((r) => <AcRow key={r.label} {...r} />)}
      </div>

      <div style={{ height: 1, backgroundColor: BORDER }} />

      <div className="px-2 py-3 flex flex-col gap-1">
        <SectionLabel>TURBOPROP & REGIONAL</SectionLabel>
        {turboprop.map((r) => <AcRow key={r.label} {...r} />)}
      </div>

      <div style={{ height: 1, backgroundColor: BORDER }} />

      <div className="px-4 py-3 flex flex-col gap-2">
        <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.05em' }}>POPULAR AIRCRAFT</span>
        <div className="flex gap-1.5 flex-wrap">
          {['B737-800', 'A320', 'B777-300ER', 'A330'].map((l) => (
            <Chip key={l} label={l} onClick={() => onSelect(l)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Date Dropdown ────────────────────────────────────────────────────────────

// Availability per day (null = outside month, 'available'|'booked'|undefined = normal)
type DayStatus = 'available' | 'booked' | null | undefined;

const weeks: { day: number | null; status: DayStatus }[][] = [
  [
    { day: null, status: null }, { day: null, status: null },
    { day: 1, status: 'booked' }, { day: 2, status: 'booked' },
    { day: 3, status: 'available' }, { day: 4, status: null }, { day: 5, status: null },
  ],
  [
    { day: 6, status: 'available' }, { day: 7, status: 'available' },
    { day: 8, status: 'available' }, { day: 9, status: 'available' },
    { day: 10, status: 'available' }, { day: 11, status: null }, { day: 12, status: null },
  ],
  [
    { day: 13, status: 'booked' }, { day: 14, status: 'booked' },
    { day: 15, status: 'available' }, { day: 16, status: 'available' },
    { day: 17, status: 'available' }, { day: 18, status: null }, { day: 19, status: null },
  ],
  [
    { day: 20, status: 'available' }, { day: 21, status: 'available' },
    { day: 22, status: 'booked' }, { day: 23, status: 'booked' },
    { day: 24, status: 'booked' }, { day: 25, status: null }, { day: 26, status: null },
  ],
  [
    { day: 27, status: undefined }, { day: 28, status: undefined },
    { day: 29, status: undefined }, { day: 30, status: undefined },
    { day: null, status: null }, { day: null, status: null }, { day: null, status: null },
  ],
];

function DateDropdown({ onSelect }: { onSelect: (v: string) => void }) {
  const [selected, setSelected] = useState<number | null>(9);
  const [flexible, setFlexible] = useState(false);

  function cellStyle(w: { day: number | null; status: DayStatus }) {
    if (w.day === null) return {};
    if (w.day === selected) return { backgroundColor: TEAL_BG, border: `2px solid ${TEAL}`, borderRadius: 8 };
    if (w.status === 'booked') return { backgroundColor: '#FEF2F2', borderRadius: 8 };
    if (w.status === 'available') return { backgroundColor: '#F0FDF4', borderRadius: 8 };
    return {};
  }

  function cellTextColor(w: { day: number | null; status: DayStatus }) {
    if (w.day === selected) return TEAL;
    if (w.status === 'booked') return '#EF4444';
    if (w.status === 'available') return '#16A34A';
    if (w.status === null) return 'transparent';
    return SECONDARY;
  }

  function cellFontWeight(w: { day: number | null; status: DayStatus }) {
    if (w.day === selected) return 700;
    if (w.status !== null && w.status !== undefined) return 500;
    return 400;
  }

  const apply = () => {
    if (selected) onSelect(`Apr ${selected}, 2026`);
  };

  return (
    <div style={{ width: 380, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between h-12 px-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <button className="hover:opacity-60 transition-opacity"><ChevronLeft size={20} color={SECONDARY} /></button>
        <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>April 2026</span>
        <button className="hover:opacity-60 transition-opacity"><ChevronRight size={20} color={SECONDARY} /></button>
      </div>

      {/* Calendar */}
      <div className="px-3 py-2 flex flex-col gap-1">
        {/* Day headers */}
        <div className="grid grid-cols-7 h-8">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="flex items-center justify-center" style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>{d}</div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0.5" style={{ height: 36 }}>
            {week.map((cell, di) => (
              <button
                key={di}
                disabled={!cell.day || cell.status === 'booked' || cell.status === null}
                onClick={() => { if (cell.day) setSelected(cell.day); }}
                className="flex items-center justify-center text-[13px] transition-colors"
                style={{ ...cellStyle(cell), fontWeight: cellFontWeight(cell), color: cellTextColor(cell) }}
              >
                {cell.day ?? ''}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ height: 1, backgroundColor: BORDER }} />

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2.5">
        {[
          { color: '#22C55E', label: 'Available' },
          { color: '#EF4444', label: 'Booked' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: SECONDARY }}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded" style={{ border: `2px solid ${TEAL}` }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: SECONDARY }}>Selected</span>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: BORDER }} />

      {/* Flexible toggle + Apply */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>Flexible dates?</span>
            <span style={{ fontSize: 11, color: MUTED }}>Show MROs with slots within ±3 days</span>
          </div>
          <button
            onClick={() => setFlexible(!flexible)}
            className="flex items-center p-0.5 rounded-full transition-colors shrink-0"
            style={{ width: 40, height: 22, backgroundColor: flexible ? TEAL : '#CBD5E1', justifyContent: flexible ? 'flex-end' : 'flex-start' }}
          >
            <span className="w-[18px] h-[18px] rounded-full bg-white block" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </button>
        </div>

        <button
          onClick={apply}
          className="w-full h-10 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: TEAL }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────

type Field = 'location' | 'service' | 'aircraft' | 'date' | null;

const FIELDS: { key: Field; icon: (active: boolean) => ReactNode; defaultLabel: string }[] = [
  {
    key: 'location',
    icon: (a) => <MapPin size={18} color={a ? TEAL : MUTED} />,
    defaultLabel: 'Location',
  },
  {
    key: 'service',
    icon: (a) => <Wrench size={18} color={a ? TEAL : MUTED} />,
    defaultLabel: 'Service Type',
  },
  {
    key: 'aircraft',
    icon: (a) => <Plane size={18} color={a ? TEAL : MUTED} />,
    defaultLabel: 'Aircraft Type',
  },
  {
    key: 'date',
    icon: (a) => <Calendar size={18} color={a ? TEAL : MUTED} />,
    defaultLabel: 'Date',
  },
];

export default function SearchBar({ onSearch }: { onSearch?: () => void }) {
  const [open, setOpen] = useState<Field>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(field: string, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setOpen(null);
  }

  function fieldStyle(key: Field) {
    const active = open === key;
    return {
      backgroundColor: active ? TEAL_BG : 'transparent',
      borderRadius: active ? 8 : 0,
      border: active ? `2px solid ${TEAL}` : '2px solid transparent',
      height: 48,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 16px',
      flex: 1,
      cursor: 'pointer',
      transition: 'all 0.15s',
    } as React.CSSProperties;
  }

  function renderDropdown(key: Field) {
    if (key === 'location') return <LocationDropdown onSelect={(v) => select('location', v)} />;
    if (key === 'service') return <ServiceDropdown onSelect={(v) => select('service', v)} />;
    if (key === 'aircraft') return <AircraftDropdown onSelect={(v) => select('aircraft', v)} />;
    if (key === 'date') return <DateDropdown onSelect={(v) => select('date', v)} />;
    return null;
  }

  return (
    <div ref={ref} style={{ position: 'relative', maxWidth: 1100, width: '100%' }}>
      {/* Bar — horizontally scrollable on small screens */}
      <div className="overflow-x-auto">
      <div
        className="flex items-center"
        style={{ backgroundColor: '#fff', borderRadius: 12, padding: 8, minWidth: 560 }}
      >
        {FIELDS.map(({ key, icon, defaultLabel }, i) => {
          const active = open === key;
          const hasValue = !!values[key!];
          return (
            <div key={key} className="flex items-center flex-1">
              <button
                style={fieldStyle(key)}
                onClick={() => setOpen(open === key ? null : key)}
              >
                {icon(active || hasValue)}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: hasValue ? 500 : 400,
                    color: active || hasValue ? NAVY : MUTED,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {values[key!] || defaultLabel}
                </span>
              </button>
              {i < FIELDS.length - 1 && (
                <div style={{ width: 1, height: 32, backgroundColor: open === key || open === FIELDS[i + 1].key ? 'transparent' : '#E2E8F0', flexShrink: 0 }} />
              )}
            </div>
          );
        })}

        {/* Search button */}
        <button
          onClick={onSearch}
          className="flex items-center gap-2 h-12 px-8 text-[15px] font-semibold text-white shrink-0 transition-colors"
          style={{ backgroundColor: TEAL, borderRadius: 8 }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
        >
          <Search size={18} />
          Search
        </button>
      </div>
      </div>{/* end overflow-x-auto */}

      {/* Dropdown panel — floats below the matching field, outside the overflow wrapper */}
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', zIndex: 50, ...(open === 'location' ? { left: 0 } : open === 'service' ? { left: '25%' } : open === 'aircraft' ? { left: '50%' } : { right: 80 }) }}>
          {renderDropdown(open)}
        </div>
      )}
    </div>
  );
}
