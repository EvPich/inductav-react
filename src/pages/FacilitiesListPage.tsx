import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Building2, CalendarDays, MessageCircle, Plane, Settings,
  Bell, Download, Plus, Search, SlidersHorizontal, Globe, Warehouse, Wrench,
  Pencil, EllipsisVertical, ChevronLeft, ChevronRight, ChevronDown,
  Signal, Wifi, BatteryFull, Menu,
} from 'lucide-react';

const NAVY = '#1C2B4A';
const TEAL = '#57A091';
const BG_LIGHT = '#F5F7FA';
const BORDER = '#E2E8F0';
const TEXT_PRIMARY = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';

// ── Responsive hook ─────────────────────────────────────────────────

function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

// ── Types & data ────────────────────────────────────────────────────

type NavKey = 'dashboard' | 'facilities' | 'manager' | 'chats' | 'bookings' | 'settings';
type FacilityStatus = 'Active' | 'Maintenance' | 'Inactive';
type TabFilter = 'All Facilities' | 'Active' | 'Maintenance' | 'Inactive';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'facilities', icon: Building2,        label: 'Facilities' },
  { key: 'manager',    icon: CalendarDays,     label: 'MRO Manager' },
  { key: 'chats',      icon: MessageCircle,    label: 'Chats', badge: 3 },
  { key: 'bookings',   icon: Plane,            label: 'Bookings' },
  { key: 'settings',   icon: Settings,         label: 'Settings' },
];

const STATUS_STYLES: Record<FacilityStatus, { bg: string; color: string }> = {
  Active:      { bg: '#F0FDF4', color: '#22C55E' },
  Maintenance: { bg: '#FEF3C7', color: '#F59E0B' },
  Inactive:    { bg: '#F1F5F9', color: '#64748B' },
};

const TABS: TabFilter[] = ['All Facilities', 'Active', 'Maintenance', 'Inactive'];

interface FacilityRow {
  name: string;
  airport: string;
  dotColor: string;
  country: string;
  city: string;
  bays: number;
  mros: number;
  status: FacilityStatus;
}

const ALL_ROWS: FacilityRow[] = [
  { name: 'Frankfurt MRO Hub',         airport: 'FRA', dotColor: '#22C55E', country: 'Germany',     city: 'Frankfurt', bays: 8,  mros: 3, status: 'Active'      },
  { name: 'Heathrow Aviation Center',  airport: 'LHR', dotColor: '#0369A1', country: 'UK',          city: 'London',    bays: 12, mros: 4, status: 'Active'      },
  { name: 'Schiphol Maintenance Base', airport: 'AMS', dotColor: '#F59E0B', country: 'Netherlands', city: 'Amsterdam', bays: 6,  mros: 2, status: 'Maintenance' },
  { name: 'Dubai Aerospace Complex',   airport: 'DXB', dotColor: '#DC2626', country: 'UAE',         city: 'Dubai',     bays: 10, mros: 3, status: 'Active'      },
  { name: 'Changi Aviation Services',  airport: 'SIN', dotColor: '#22C55E', country: 'Singapore',   city: 'Singapore', bays: 5,  mros: 2, status: 'Inactive'    },
  { name: 'Charles de Gaulle Center',  airport: 'CDG', dotColor: '#0369A1', country: 'France',      city: 'Paris',     bays: 9,  mros: 3, status: 'Active'      },
  { name: 'Narita Aviation Hub',       airport: 'NRT', dotColor: '#22C55E', country: 'Japan',       city: 'Tokyo',     bays: 4,  mros: 1, status: 'Maintenance' },
];

const COL = { facility: 260, airport: 100, countryCIty: 200, bays: 80, mros: 80, status: 110, actions: 80 };

const COUNTRIES = ['All Countries', 'Germany', 'UK', 'Netherlands', 'UAE', 'Singapore', 'France', 'Japan'];

// ── Props ───────────────────────────────────────────────────────────

interface Props {
  onDashboard?: () => void;
  onManager?: () => void;
  onChats?: () => void;
  onBookings?: () => void;
  onViewFacility?: () => void;
}

// ── Page ────────────────────────────────────────────────────────────

export default function FacilitiesListPage({ onDashboard, onManager, onChats, onBookings, onViewFacility }: Props) {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileLayout onDashboard={onDashboard} onManager={onManager} onChats={onChats} onBookings={onBookings} onViewFacility={onViewFacility} />;
  }

  return <DesktopLayout onDashboard={onDashboard} onManager={onManager} onChats={onChats} onBookings={onBookings} onViewFacility={onViewFacility} />;
}

// ── Desktop ─────────────────────────────────────────────────────────

function DesktopLayout({ onDashboard, onManager, onChats, onBookings, onViewFacility }: Props) {
  const [activeTab, setActiveTab] = useState<TabFilter>('All Facilities');
  const [country, setCountry]     = useState('All Countries');
  const [search, setSearch]       = useState('');
  const [countryOpen, setCountryOpen] = useState(false);

  const navHandlers: Partial<Record<NavKey, () => void>> = {
    dashboard: onDashboard,
    manager:   onManager,
    chats:     onChats,
    bookings:  onBookings,
  };

  const filtered = ALL_ROWS.filter((r) => {
    const matchesTab     = activeTab === 'All Facilities' || r.status === activeTab;
    const matchesCountry = country === 'All Countries' || r.country === country;
    const q              = search.toLowerCase();
    const matchesSearch  = !q || r.name.toLowerCase().includes(q) || r.airport.toLowerCase().includes(q) || r.city.toLowerCase().includes(q);
    return matchesTab && matchesCountry && matchesSearch;
  });

  return (
    <div className="flex overflow-hidden" style={{ height: '100vh', backgroundColor: BG_LIGHT, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar */}
      <div className="flex flex-col shrink-0" style={{ width: 240, backgroundColor: NAVY, height: '100%' }}>
        <div className="flex flex-col flex-1 gap-6">
          <div style={{ padding: '24px 20px' }}>
            <img src="/logo-light.png" alt="InductAV" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </div>
          <nav className="flex flex-col gap-1" style={{ padding: '0 12px' }}>
            {NAV_ITEMS.map(({ key, icon: Icon, label, badge }) => {
              const active = key === 'facilities';
              return (
                <button
                  key={key}
                  onClick={navHandlers[key]}
                  className="flex items-center justify-between w-full text-left"
                  style={{ padding: '10px 14px', borderRadius: 8, cursor: navHandlers[key] ? 'pointer' : 'default', backgroundColor: active ? '#243656' : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} color={active ? '#FFFFFF' : TEXT_MUTED} />
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? '#FFFFFF' : TEXT_MUTED }}>{label}</span>
                  </div>
                  {badge && (
                    <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#EF4444' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{badge}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderTop: '1px solid #243656' }}>
          <div className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: TEAL }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>LT</span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Lufthansa Technik</span>
            <span style={{ fontSize: 11, color: TEXT_MUTED }}>MRO Admin</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between shrink-0" style={{ height: 64, backgroundColor: '#FFFFFF', borderBottom: `1px solid ${BORDER}`, padding: '0 28px' }}>
          <div className="flex flex-col gap-0.5">
            <span style={{ fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>Facilities</span>
            <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>Manage all facilities and locations</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
              <Bell size={18} color={TEXT_SECONDARY} />
            </button>
            <button className="flex items-center gap-2" style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
              <Download size={15} color={TEXT_SECONDARY} />
              <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Export</span>
            </button>
            <button className="flex items-center gap-2" style={{ padding: '8px 14px', borderRadius: 8, backgroundColor: TEAL, cursor: 'pointer' }}>
              <Plus size={15} color="#FFFFFF" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Add Facility</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto" style={{ padding: 24, gap: 20 }}>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Facilities', value: '12', sub: '+2 this quarter', Icon: Building2, iconBg: '#EDF7F4', iconColor: TEAL },
              { label: 'Active Bays',      value: '48', sub: 'Across all facilities', Icon: Warehouse, iconBg: '#F0FDF4', iconColor: '#22C55E' },
              { label: 'Countries',        value: '6',  sub: 'Global presence',       Icon: Globe,    iconBg: '#F0FDF4', iconColor: '#22C55E' },
              { label: 'Total MROs',       value: '15', sub: '+3 this year',          Icon: Wrench,   iconBg: '#FEF3C7', iconColor: '#F59E0B' },
            ].map(({ label, value, sub, Icon, iconBg, iconColor }) => (
              <div key={label} className="flex items-center gap-4" style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, padding: '16px 20px' }}>
                <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: iconBg }}>
                  <Icon size={22} color={iconColor} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span style={{ fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1.2 }}>{value}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>{label}</span>
                  <span style={{ fontSize: 11, color: TEXT_MUTED }}>{sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, padding: '12px 16px' }}>
            <div className="flex items-center gap-2">
              {/* Tab pills */}
              <div className="flex gap-1">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
                      backgroundColor: activeTab === t ? NAVY : 'transparent',
                      color: activeTab === t ? '#FFFFFF' : TEXT_SECONDARY,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {/* Country dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCountryOpen((v) => !v)}
                  className="flex items-center gap-1.5"
                  style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13, color: TEXT_SECONDARY }}
                >
                  {country}
                  <ChevronDown size={14} color={TEXT_MUTED} style={{ transform: countryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>
                {countryOpen && (
                  <div className="absolute top-full left-0 mt-1 z-20" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 160, overflow: 'hidden' }}>
                    {COUNTRIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCountry(c); setCountryOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13, color: c === country ? TEAL : TEXT_PRIMARY, backgroundColor: c === country ? '#EDF7F4' : 'transparent', cursor: 'pointer', fontWeight: c === country ? 600 : 400 }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2" style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
                <Search size={14} color={TEXT_MUTED} />
                <input
                  placeholder="Search facilities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 13, color: TEXT_PRIMARY, backgroundColor: 'transparent', width: 180 }}
                />
              </div>
              <button className="flex items-center gap-2" style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                <SlidersHorizontal size={14} color={TEXT_SECONDARY} />
                <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>Filters</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex items-center" style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 20px', height: 44, backgroundColor: BG_LIGHT }}>
              <span style={{ width: COL.facility, fontSize: 12, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Facility</span>
              <span style={{ width: COL.airport,  fontSize: 12, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Airport</span>
              <span style={{ width: COL.countryCIty, fontSize: 12, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Country / City</span>
              <span style={{ width: COL.bays,     fontSize: 12, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bays</span>
              <span style={{ width: COL.mros,     fontSize: 12, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>MROs</span>
              <span style={{ width: COL.status,   fontSize: 12, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</span>
              <span style={{ width: COL.actions,  fontSize: 12, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actions</span>
            </div>
            {/* Rows */}
            {filtered.map((row, i) => {
              const s = STATUS_STYLES[row.status];
              return (
                <div
                  key={row.name}
                  className="flex items-center"
                  style={{ padding: '0 20px', height: 56, borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer' }}
                  onClick={onViewFacility}
                >
                  <div className="flex items-center gap-2" style={{ width: COL.facility }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ width: COL.airport }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: row.dotColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.airport}</span>
                  </div>
                  <div className="flex flex-col" style={{ width: COL.countryCIty }}>
                    <span style={{ fontSize: 13, color: TEXT_PRIMARY }}>{row.country}</span>
                    <span style={{ fontSize: 11, color: TEXT_MUTED }}>{row.city}</span>
                  </div>
                  <span style={{ width: COL.bays, fontSize: 13, color: TEXT_PRIMARY }}>{row.bays}</span>
                  <span style={{ width: COL.mros, fontSize: 13, color: TEXT_PRIMARY }}>{row.mros}</span>
                  <div style={{ width: COL.status }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
                      {row.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" style={{ width: COL.actions }}>
                    <button style={{ padding: 6, borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onViewFacility?.(); }}>
                      <Pencil size={15} color={TEXT_MUTED} />
                    </button>
                    <button style={{ padding: 6, borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
                      <EllipsisVertical size={15} color={TEXT_MUTED} />
                    </button>
                  </div>
                </div>
              );
            })}
            {/* Pagination */}
            <div className="flex items-center justify-between" style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>Showing 1–{filtered.length} of 12 facilities</span>
              <div className="flex items-center gap-1">
                <button style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={14} color={TEXT_SECONDARY} />
                </button>
                {[1, 2].map((n) => (
                  <button
                    key={n}
                    style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${n === 1 ? NAVY : BORDER}`, backgroundColor: n === 1 ? NAVY : '#FFFFFF', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: n === 1 ? '#FFFFFF' : TEXT_SECONDARY }}
                  >
                    {n}
                  </button>
                ))}
                <button style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={14} color={TEXT_SECONDARY} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile ──────────────────────────────────────────────────────────

const MOBILE_TABS: TabFilter[] = ['All Facilities', 'Active', 'Maintenance', 'Inactive'];

function MobileLayout({ onDashboard, onManager, onChats, onBookings, onViewFacility }: Props) {
  const [activeTab, setActiveTab] = useState<TabFilter>('All Facilities');

  const filtered = ALL_ROWS.filter((r) => activeTab === 'All Facilities' || r.status === activeTab);

  const tabs = [
    { key: 'facilities' as NavKey, Icon: Building2,        label: 'Facilities', active: true,  onClick: undefined },
    { key: 'dashboard'  as NavKey, Icon: LayoutDashboard,  label: 'Dashboard',  active: false, onClick: onDashboard },
    { key: 'manager'    as NavKey, Icon: CalendarDays,     label: 'Slots',      active: false, onClick: onManager },
    { key: 'chats'      as NavKey, Icon: MessageCircle,    label: 'Chats',      active: false, onClick: onChats },
    { key: 'bookings'   as NavKey, Icon: Plane,            label: 'Bookings',   active: false, onClick: onBookings },
  ];

  return (
    <div className="flex flex-col" style={{ height: '100vh', backgroundColor: NAVY, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Status bar */}
      <div className="flex items-center justify-between shrink-0" style={{ height: 44, padding: '0 16px' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal size={14} color="#FFFFFF" />
          <Wifi size={14} color="#FFFFFF" />
          <BatteryFull size={14} color="#FFFFFF" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between shrink-0" style={{ height: 52, padding: '0 16px' }}>
        <button style={{ padding: 6, borderRadius: 8, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
          <Menu size={22} color="#FFFFFF" />
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Facilities</span>
        <button style={{ padding: 6, borderRadius: 8, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
          <Bell size={20} color="#FFFFFF" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto" style={{ backgroundColor: BG_LIGHT, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3" style={{ padding: '16px 16px 8px' }}>
          {[
            { label: 'Total Facilities', value: '12', Icon: Building2, iconBg: '#EDF7F4', iconColor: TEAL },
            { label: 'Active Bays',      value: '48', Icon: Warehouse, iconBg: '#F0FDF4', iconColor: '#22C55E' },
            { label: 'Countries',        value: '6',  Icon: Globe,    iconBg: '#F0FDF4', iconColor: '#22C55E' },
            { label: 'Total MROs',       value: '15', Icon: Wrench,   iconBg: '#FEF3C7', iconColor: '#F59E0B' },
          ].map(({ label, value, Icon, iconBg, iconColor }) => (
            <div key={label} className="flex items-center gap-3" style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, padding: '14px 14px' }}>
              <div className="flex items-center justify-center shrink-0" style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: iconBg }}>
                <Icon size={19} color={iconColor} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1.1 }}>{value}</span>
                <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto" style={{ padding: '4px 16px 12px', scrollbarWidth: 'none' }}>
          {MOBILE_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
                backgroundColor: activeTab === t ? NAVY : '#FFFFFF',
                color: activeTab === t ? '#FFFFFF' : TEXT_SECONDARY,
                boxShadow: activeTab === t ? 'none' : `0 1px 3px rgba(0,0,0,0.08)`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Facility cards */}
        <div className="flex flex-col gap-3" style={{ padding: '0 16px 100px' }}>
          {filtered.map((row) => {
            const s = STATUS_STYLES[row.status];
            return (
              <button
                key={row.name}
                onClick={onViewFacility}
                className="flex flex-col w-full text-left"
                style={{ backgroundColor: '#FFFFFF', borderRadius: 14, border: `1px solid ${BORDER}`, padding: '14px 16px', gap: 10, cursor: 'pointer' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY }}>{row.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: row.dotColor, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.airport} · {row.city}, {row.country}</span>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
                    {row.status}
                  </span>
                </div>
                <div className="flex items-center gap-4" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
                  <div className="flex items-center gap-1.5">
                    <Warehouse size={13} color={TEXT_MUTED} />
                    <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.bays} bays</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench size={13} color={TEXT_MUTED} />
                    <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.mros} MROs</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom tab bar */}
      <div
        className="flex items-center justify-around shrink-0"
        style={{ position: 'absolute', bottom: 16, left: 16, right: 16, height: 62, backgroundColor: NAVY, borderRadius: 36, zIndex: 10 }}
      >
        {tabs.map(({ key, Icon, label, active, onClick }) => (
          <button
            key={key}
            onClick={onClick}
            className="flex flex-col items-center gap-1"
            style={{ flex: 1, padding: '8px 0', border: 'none', backgroundColor: 'transparent', cursor: onClick ? 'pointer' : 'default' }}
          >
            <div style={{ padding: '4px 12px', borderRadius: 16, backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
              <Icon size={20} color={active ? '#FFFFFF' : 'rgba(255,255,255,0.45)'} />
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
