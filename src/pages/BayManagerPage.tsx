import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Building2, CalendarDays, MessageCircle, Plane, Settings,
  ArrowLeft, PencilLine, Plus, Search, SlidersHorizontal, Warehouse,
  Pencil, EllipsisVertical, ChevronLeft, ChevronRight, ChevronDown,
  Signal, Wifi, BatteryFull,
} from 'lucide-react';

const NAVY = '#1C2B4A';
const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
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
type BayStatus = 'Available' | 'Booked' | 'Maintenance';
type TabFilter = 'All Bays' | 'Available' | 'Booked' | 'Maintenance';
type BayType = 'Wide-body' | 'Narrow-body' | 'Regional';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'facilities', icon: Building2,        label: 'Facilities' },
  { key: 'manager',    icon: CalendarDays,     label: 'MRO Manager' },
  { key: 'chats',      icon: MessageCircle,    label: 'Chats', badge: 3 },
  { key: 'bookings',   icon: Plane,            label: 'Bookings' },
  { key: 'settings',   icon: Settings,         label: 'Settings' },
];

const STATUS_STYLES: Record<BayStatus, { bg: string; color: string }> = {
  Available:   { bg: '#DCFCE7', color: '#16A34A' },
  Booked:      { bg: '#E0F2FE', color: '#0369A1' },
  Maintenance: { bg: '#FEF3C7', color: '#D97706' },
};

const BAY_TYPES: BayType[] = ['Wide-body', 'Narrow-body', 'Regional'];
const TABS: TabFilter[] = ['All Bays', 'Available', 'Booked', 'Maintenance'];

interface BayRow {
  bay: string;
  type: BayType;
  dotColor: string;
  capacity: string;
  schedule: string;
  scheduleOrange?: boolean;
  operator: string | null;
  avatar: { initial: string; color: string } | null;
  status: BayStatus;
}

const ALL_BAYS: BayRow[] = [
  { bay: 'Bay A-1', type: 'Wide-body',   dotColor: '#22C55E', capacity: 'A330 / A340',  schedule: 'Apr 25 – 28, 2026',  operator: 'Lufthansa', avatar: null,                               status: 'Booked'      },
  { bay: 'Bay A-2', type: 'Wide-body',   dotColor: '#0369A1', capacity: 'B777 / B787',  schedule: '—',                   operator: null,        avatar: { initial: 'R', color: '#009DE0' }, status: 'Available'   },
  { bay: 'Bay B-1', type: 'Narrow-body', dotColor: '#F59E0B', capacity: 'A320 Family',  schedule: 'Apr 22 – May 1, 2026',operator: 'Ryanair',   avatar: null,                               status: 'Booked'      },
  { bay: 'Bay B-2', type: 'Narrow-body', dotColor: '#DC2626', capacity: 'B737 MAX',     schedule: '—',                   operator: null,        avatar: { initial: 'T', color: '#DC2626' }, status: 'Available'   },
  { bay: 'Bay C-1', type: 'Regional',    dotColor: '#22C55E', capacity: 'E190 / E195',  schedule: 'Maintenance', scheduleOrange: true, operator: null, avatar: null,                        status: 'Maintenance' },
  { bay: 'Bay C-2', type: 'Regional',    dotColor: '#0369A1', capacity: 'CRJ-900',      schedule: 'May 5 – 8, 2026',     operator: 'Swiss Air', avatar: { initial: 'D', color: '#F59E0B' }, status: 'Booked'      },
  { bay: 'Bay D-1', type: 'Wide-body',   dotColor: '#22C55E', capacity: 'A380',         schedule: 'May 10 – 20, 2026',   operator: 'Emirates',  avatar: { initial: 'E', color: '#22C55E' }, status: 'Booked'      },
];

const COL = { bay: 120, type: 120, capacity: 140, schedule: 160, operator: 140, status: 130, actions: 80 };

const SERVICES    = ['Heavy Maint.', 'Engine Overhaul', 'Component Repair', 'Line Maint.'];
const APPROVALS   = ['EASA', 'FAA', 'GCAA'];
const CERTS       = ['ISO 9001', 'AS9110C', 'Nadcap'];

// ── Props ───────────────────────────────────────────────────────────

export interface MROContext {
  name: string;
  facility: string;
  facilityCode: string;
  type: string;
  bays: number;
  parking: number;
}

interface Props {
  mro?: MROContext;
  onBack?: () => void;
  onDashboard?: () => void;
  onFacilities?: () => void;
  onChats?: () => void;
  onBookings?: () => void;
}

const DEFAULT_MRO: MROContext = {
  name: 'Lufthansa Technik',
  facility: 'Frankfurt MRO Hub',
  facilityCode: 'FRA',
  type: 'Heavy Maintenance',
  bays: 8,
  parking: 12,
};

// ── Page ────────────────────────────────────────────────────────────

export default function BayManagerPage({ mro = DEFAULT_MRO, onBack, onDashboard, onFacilities, onChats, onBookings }: Props) {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileLayout mro={mro} onBack={onBack} onDashboard={onDashboard} onFacilities={onFacilities} onChats={onChats} onBookings={onBookings} />;
  }

  return <DesktopLayout mro={mro} onBack={onBack} onDashboard={onDashboard} onFacilities={onFacilities} onChats={onChats} onBookings={onBookings} />;
}

// ── Desktop ─────────────────────────────────────────────────────────

function DesktopLayout({ mro, onBack, onDashboard, onFacilities, onChats, onBookings }: Props & { mro: MROContext }) {
  const [activeTab, setActiveTab]     = useState<TabFilter>('All Bays');
  const [typeFilter, setTypeFilter]   = useState<BayType | 'All Types'>('All Types');
  const [search, setSearch]           = useState('');
  const [typeOpen, setTypeOpen]       = useState(false);

  const navHandlers: Partial<Record<NavKey, () => void>> = {
    dashboard:  onDashboard,
    facilities: onFacilities,
    chats:      onChats,
    bookings:   onBookings,
    manager:    onBack,
  };

  const filtered = ALL_BAYS.filter((r) => {
    const matchesTab  = activeTab === 'All Bays' || r.status === activeTab;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    const q           = search.toLowerCase();
    const matchSearch = !q || r.bay.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || (r.operator?.toLowerCase().includes(q) ?? false);
    return matchesTab && matchesType && matchSearch;
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
              const active = key === 'manager';
              return (
                <button
                  key={key}
                  onClick={navHandlers[key]}
                  className="flex items-center justify-between w-full text-left"
                  style={{ padding: '10px 14px', borderRadius: 8, cursor: navHandlers[key] ? 'pointer' : 'default', backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent' }}
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
        <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5"
              style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: 'transparent', cursor: 'pointer', flexShrink: 0 }}
            >
              <ArrowLeft size={15} color={TEXT_SECONDARY} />
              <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Back</span>
            </button>
            <div className="flex flex-col gap-0.5">
              <span style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>{mro.name}</span>
              <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>Bay Manager · {mro.facility} ({mro.facilityCode})</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2" style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
              <PencilLine size={15} color={TEXT_SECONDARY} />
              <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Edit MRO</span>
            </button>
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: TEAL, border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Plus size={15} color="#FFFFFF" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Add Bay</span>
            </button>
          </div>
        </div>

        {/* MRO Info Section */}
        <div className="flex flex-col gap-3 shrink-0" style={{ backgroundColor: '#FFFFFF', borderBottom: `1px solid ${BORDER}`, padding: '16px 28px' }}>
          {/* Info row */}
          <div className="flex items-center gap-6">
            <InfoField label="Facility"      value={`${mro.facility} (${mro.facilityCode})`} />
            <div style={{ width: 1, height: 30, backgroundColor: BORDER, flexShrink: 0 }} />
            <InfoField label="Type"          value={mro.type} />
            <div style={{ width: 1, height: 30, backgroundColor: BORDER, flexShrink: 0 }} />
            <InfoField label="Bays"          value={String(mro.bays)} />
            <div style={{ width: 1, height: 30, backgroundColor: BORDER, flexShrink: 0 }} />
            <InfoField label="Parking Slots" value={String(mro.parking)} />
            <div style={{ width: 1, height: 30, backgroundColor: BORDER, flexShrink: 0 }} />
            <div className="flex flex-col gap-0.5">
              <span style={{ fontSize: 11, fontWeight: 500, color: TEXT_MUTED }}>Status</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: '#DCFCE7', color: '#16A34A' }}>Active</span>
            </div>
          </div>
          {/* Tags rows */}
          <TagRow label="Services:"  items={SERVICES}  itemBg="#EDF7F4"  itemColor={TEAL}       moreBg="#F1F5F9" moreColor={TEXT_MUTED} moreLabel="+8 more" />
          <TagRow label="Approvals:" items={APPROVALS} itemBg="#DCFCE7"  itemColor="#16A34A"    moreBg="#F1F5F9" moreColor={TEXT_MUTED} moreLabel="+5 more" />
          <TagRow label="Certs:"     items={CERTS}     itemBg="#F1F5F9"  itemColor="#64748B"    moreBg="#F1F5F9" moreColor={TEXT_MUTED} moreLabel="+2 more" />
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${BORDER}`, padding: '12px 28px', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: activeTab === t ? 600 : 500,
                  cursor: 'pointer', border: activeTab === t ? 'none' : `1px solid ${BORDER}`,
                  backgroundColor: activeTab === t ? TEAL : 'transparent',
                  color: activeTab === t ? '#FFFFFF' : TEXT_SECONDARY,
                }}
              >
                {t}
              </button>
            ))}
            {/* Filter by Type */}
            <div className="relative">
              <button
                onClick={() => setTypeOpen((v) => !v)}
                className="flex items-center gap-1.5"
                style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13, color: TEXT_SECONDARY }}
              >
                {typeFilter}
                <ChevronDown size={14} color={TEXT_MUTED} style={{ transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
              {typeOpen && (
                <div className="absolute top-full left-0 mt-1 z-20" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 160, overflow: 'hidden' }}>
                  {(['All Types', ...BAY_TYPES] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTypeFilter(t); setTypeOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13, color: t === typeFilter ? TEAL : TEXT_PRIMARY, backgroundColor: t === typeFilter ? '#EDF7F4' : 'transparent', cursor: 'pointer', fontWeight: t === typeFilter ? 600 : 400 }}
                    >
                      {t}
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
                placeholder="Search bays..."
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
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto" style={{ padding: '20px 28px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex items-center" style={{ padding: '0 20px', height: 48, backgroundColor: BG_LIGHT, borderBottom: `1px solid ${BORDER}` }}>
              {[
                { label: 'Bay',       w: COL.bay      },
                { label: 'Type',      w: COL.type     },
                { label: 'Capacity',  w: COL.capacity },
                { label: 'Schedule',  w: COL.schedule },
                { label: 'Operator',  w: COL.operator },
                { label: 'Status',    w: COL.status   },
                { label: 'Actions',   w: COL.actions  },
              ].map(({ label, w }) => (
                <span key={label} style={{ width: w, flexShrink: 0, fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {label}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((row, i) => {
              const s = STATUS_STYLES[row.status];
              return (
                <div
                  key={row.bay}
                  className="flex items-center"
                  style={{ padding: '0 20px', height: 56, borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                >
                  {/* Bay */}
                  <div className="flex items-center gap-2" style={{ width: COL.bay, flexShrink: 0 }}>
                    <Warehouse size={15} color={row.status === 'Maintenance' ? '#F59E0B' : TEAL} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.bay}</span>
                  </div>
                  {/* Type */}
                  <div className="flex items-center gap-1.5" style={{ width: COL.type, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: row.dotColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{row.type}</span>
                  </div>
                  {/* Capacity */}
                  <span style={{ width: COL.capacity, flexShrink: 0, fontSize: 13, color: TEXT_PRIMARY }}>{row.capacity}</span>
                  {/* Schedule */}
                  <span style={{ width: COL.schedule, flexShrink: 0, fontSize: 13, color: row.scheduleOrange ? '#F59E0B' : (row.schedule === '—' ? TEXT_MUTED : TEXT_SECONDARY) }}>
                    {row.schedule}
                  </span>
                  {/* Operator */}
                  <div className="flex items-center gap-1.5" style={{ width: COL.operator, flexShrink: 0 }}>
                    {row.avatar && (
                      <div className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: row.avatar.color }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{row.avatar.initial}</span>
                      </div>
                    )}
                    <span style={{ fontSize: 13, fontWeight: row.operator ? 500 : 400, color: row.operator ? TEXT_PRIMARY : TEXT_MUTED }}>
                      {row.operator ?? '—'}
                    </span>
                  </div>
                  {/* Status */}
                  <div style={{ width: COL.status, flexShrink: 0 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
                      {row.status}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1" style={{ width: COL.actions, flexShrink: 0 }}>
                    <button style={{ padding: 6, borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                      <Pencil size={15} color={TEXT_MUTED} />
                    </button>
                    <button style={{ padding: 6, borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                      <EllipsisVertical size={15} color={TEXT_MUTED} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            <div className="flex items-center justify-between" style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
              <span style={{ fontSize: 13, color: TEXT_MUTED }}>Showing 1–{filtered.length} of {ALL_BAYS.length} bays</span>
              <div className="flex items-center gap-1">
                <button style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={14} color={TEXT_SECONDARY} />
                </button>
                {[1, 2].map((n) => (
                  <button key={n} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${n === 1 ? TEAL : BORDER}`, backgroundColor: n === 1 ? TEAL : '#FFFFFF', cursor: 'pointer', fontSize: 13, fontWeight: n === 1 ? 600 : 500, color: n === 1 ? '#FFFFFF' : TEXT_SECONDARY }}>
                    {n}
                  </button>
                ))}
                <button style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

// ── Helpers ──────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span style={{ fontSize: 11, fontWeight: 500, color: TEXT_MUTED }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{value}</span>
    </div>
  );
}

function TagRow({ label, items, itemBg, itemColor, moreBg, moreColor, moreLabel }: {
  label: string; items: string[]; itemBg: string; itemColor: string; moreBg: string; moreColor: string; moreLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, flexShrink: 0 }}>{label}</span>
      {items.map((item) => (
        <span key={item} style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: itemBg, color: itemColor }}>
          {item}
        </span>
      ))}
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, backgroundColor: moreBg, color: moreColor }}>
        {moreLabel}
      </span>
    </div>
  );
}

// ── Mobile ──────────────────────────────────────────────────────────

function MobileLayout({ mro, onBack, onDashboard, onFacilities, onChats, onBookings }: Props & { mro: MROContext }) {
  const [activeTab, setActiveTab] = useState<TabFilter>('All Bays');

  const filtered = ALL_BAYS.filter((r) => activeTab === 'All Bays' || r.status === activeTab);

  const tabs = [
    { key: 'dashboard',  Icon: LayoutDashboard, label: 'HOME',       active: false, onClick: onDashboard },
    { key: 'manager',    Icon: CalendarDays,     label: 'SLOTS',      active: true,  onClick: onBack },
    { key: 'chats',      Icon: MessageCircle,    label: 'MESSAGES',   active: false, onClick: onChats },
    { key: 'bookings',   Icon: Plane,            label: 'SAVED',      active: false, onClick: onBookings },
    { key: 'facilities', Icon: Building2,        label: 'FACILITIES', active: false, onClick: onFacilities },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 430, height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: NAVY, fontFamily: 'Inter, system-ui, sans-serif', margin: '0 auto', overflow: 'hidden' }}>

      {/* Status bar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Signal size={14} color="#FFFFFF" />
          <Wifi size={14} color="#FFFFFF" />
          <BatteryFull size={14} color="#FFFFFF" />
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{mro.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Bay Manager · {mro.facility} ({mro.facilityCode})</div>
          </div>
        </div>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: TEAL, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={13} />
          Add Bay
        </button>
      </div>

      {/* Info strip */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', margin: '0 16px 0', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>BAYS</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{mro.bays}</span>
        </div>
        <div style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>PARKING</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{mro.parking}</span>
        </div>
        <div style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>TYPE</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>{mro.type}</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: '#DCFCE7', color: '#16A34A' }}>Active</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ backgroundColor: BG_LIGHT, borderTopLeftRadius: 20, borderTopRightRadius: 20, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Filter tabs */}
        <div style={{ backgroundColor: '#FFFFFF', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          {TABS.map((t) => {
            const active = activeTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{ flexShrink: 0, position: 'relative', padding: '12px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 500, color: active ? TEAL : TEXT_SECONDARY }}
              >
                {t}
                {active && <div style={{ position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: TEAL, borderRadius: 1 }} />}
              </button>
            );
          })}
        </div>
        <div style={{ height: 1, backgroundColor: BORDER, flexShrink: 0 }} />

        {/* Bay cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 100 }}>
          {filtered.map((row) => {
            const s = STATUS_STYLES[row.status];
            return (
              <div key={row.bay} style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Top */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Warehouse size={16} color={row.status === 'Maintenance' ? '#F59E0B' : TEAL} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>{row.bay}</span>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
                    {row.status}
                  </span>
                </div>
                {/* Mid */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: row.dotColor }} />
                    <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.type}</span>
                  </div>
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>·</span>
                  <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.capacity}</span>
                </div>
                {/* Bottom */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {row.avatar && (
                      <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: row.avatar.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#FFFFFF' }}>{row.avatar.initial}</span>
                      </div>
                    )}
                    <span style={{ fontSize: 12, color: row.operator ? TEXT_PRIMARY : TEXT_MUTED, fontWeight: row.operator ? 500 : 400 }}>
                      {row.operator ?? 'No operator'}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: row.scheduleOrange ? '#F59E0B' : TEXT_SECONDARY }}>{row.schedule}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom tab bar */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: NAVY, borderRadius: 36, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 10 }}>
        {tabs.map(({ key, Icon, label, active, onClick }) => (
          <button
            key={key}
            onClick={onClick}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', backgroundColor: 'transparent', cursor: onClick ? 'pointer' : 'default' }}
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
