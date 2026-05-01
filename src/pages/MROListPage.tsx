import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Building2, CalendarDays, MessageCircle, Plane, Settings,
  Download, Plus, Search, SlidersHorizontal, Warehouse,
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
type MROStatus = 'Active' | 'Under Maintenance' | 'Inactive';
type TabFilter = 'All MROs' | 'Active' | 'Under Maintenance' | 'Inactive';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'facilities', icon: Building2,        label: 'Facilities' },
  { key: 'manager',    icon: CalendarDays,     label: 'MRO Manager' },
  { key: 'chats',      icon: MessageCircle,    label: 'Chats', badge: 3 },
  { key: 'bookings',   icon: Plane,            label: 'Bookings' },
  { key: 'settings',   icon: Settings,         label: 'Settings' },
];

const STATUS_STYLES: Record<MROStatus, { bg: string; color: string }> = {
  'Active':            { bg: '#F0FDF4', color: '#16A34A' },
  'Under Maintenance': { bg: '#FEF3C7', color: '#D97706' },
  'Inactive':          { bg: '#F1F5F9', color: '#64748B' },
};

const TABS: TabFilter[] = ['All MROs', 'Active', 'Under Maintenance', 'Inactive'];

interface MRORow {
  name: string;
  facility: string;
  facilityCode: string;
  dotColor: string;
  type: string;
  bays: number;
  parking: number;
  avatar: { initial: string; color: string } | null;
  status: MROStatus;
}

const ALL_ROWS: MRORow[] = [
  { name: 'Lufthansa Technik',    facility: 'Frankfurt', facilityCode: 'FRA', dotColor: '#22C55E', type: 'Heavy Maintenance', bays: 8,  parking: 12, avatar: null,                                 status: 'Active'            },
  { name: 'BA Engineering',       facility: 'London',    facilityCode: 'LHR', dotColor: '#0369A1', type: 'Line & Base',       bays: 12, parking: 20, avatar: { initial: 'R', color: '#009DE0' },   status: 'Active'            },
  { name: 'KLM Engineering',      facility: 'Amsterdam', facilityCode: 'AMS', dotColor: '#F59E0B', type: 'Component Repair',  bays: 6,  parking: 8,  avatar: null,                                 status: 'Under Maintenance' },
  { name: 'Emirates Engineering', facility: 'Dubai',     facilityCode: 'DXB', dotColor: '#DC2626', type: 'Full Service',      bays: 10, parking: 15, avatar: { initial: 'T', color: '#DC2626' },   status: 'Active'            },
  { name: 'ST Engineering',       facility: 'Singapore', facilityCode: 'SIN', dotColor: '#22C55E', type: 'Line Maintenance',  bays: 5,  parking: 10, avatar: null,                                 status: 'Active'            },
  { name: 'Air France Industries',facility: 'Paris',     facilityCode: 'CDG', dotColor: '#0369A1', type: 'Heavy Check',       bays: 9,  parking: 14, avatar: { initial: 'D', color: '#F59E0B' },   status: 'Active'            },
  { name: 'ANA MRO Services',     facility: 'Tokyo',     facilityCode: 'NRT', dotColor: '#22C55E', type: 'Base Maintenance',  bays: 4,  parking: 6,  avatar: { initial: 'E', color: '#22C55E' },   status: 'Under Maintenance' },
];

const COL = { name: 250, facility: 140, type: 160, bays: 70, parking: 80, status: 150, actions: 80 };

const FACILITIES = ['All Facilities', 'Frankfurt FRA', 'London LHR', 'Amsterdam AMS', 'Dubai DXB', 'Singapore SIN', 'Paris CDG', 'Tokyo NRT'];

// ── Props ───────────────────────────────────────────────────────────

interface Props {
  onDashboard?: () => void;
  onFacilities?: () => void;
  onChats?: () => void;
  onBookings?: () => void;
  onViewBays?: () => void;
}

// ── Page ────────────────────────────────────────────────────────────

export default function MROListPage({ onDashboard, onFacilities, onChats, onBookings, onViewBays }: Props) {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileLayout onDashboard={onDashboard} onFacilities={onFacilities} onChats={onChats} onBookings={onBookings} onViewBays={onViewBays} />;
  }

  return <DesktopLayout onDashboard={onDashboard} onFacilities={onFacilities} onChats={onChats} onBookings={onBookings} onViewBays={onViewBays} />;
}

// ── Desktop ─────────────────────────────────────────────────────────

function DesktopLayout({ onDashboard, onFacilities, onChats, onBookings, onViewBays }: Props) {
  const [activeTab, setActiveTab] = useState<TabFilter>('All MROs');
  const [facility, setFacility]   = useState('All Facilities');
  const [search, setSearch]       = useState('');
  const [facOpen, setFacOpen]     = useState(false);

  const navHandlers: Partial<Record<NavKey, () => void>> = {
    dashboard:  onDashboard,
    facilities: onFacilities,
    chats:      onChats,
    bookings:   onBookings,
  };

  const filtered = ALL_ROWS.filter((r) => {
    const matchesTab = activeTab === 'All MROs' || r.status === activeTab;
    const matchesFac = facility === 'All Facilities' || `${r.facility} ${r.facilityCode}` === facility;
    const q = search.toLowerCase();
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.facility.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
    return matchesTab && matchesFac && matchesSearch;
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
          <div className="flex flex-col gap-0.5">
            <span style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>MRO Manager</span>
            <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>Manage all MRO operations</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2" style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
              <Download size={16} color={TEXT_SECONDARY} />
              <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Export</span>
            </button>
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: TEAL, border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Plus size={16} color="#FFFFFF" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Add MRO</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto" style={{ padding: 24, gap: 16 }}>

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
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: activeTab === t ? 600 : 500,
                      cursor: 'pointer', border: activeTab === t ? 'none' : `1px solid ${BORDER}`,
                      backgroundColor: activeTab === t ? TEAL : 'transparent',
                      color: activeTab === t ? '#FFFFFF' : TEXT_SECONDARY,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {/* Filter by Facility */}
              <div className="relative">
                <button
                  onClick={() => setFacOpen((v) => !v)}
                  className="flex items-center gap-1.5"
                  style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13, color: TEXT_SECONDARY }}
                >
                  {facility}
                  <ChevronDown size={14} color={TEXT_MUTED} style={{ transform: facOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>
                {facOpen && (
                  <div className="absolute top-full left-0 mt-1 z-20" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 180, overflow: 'hidden' }}>
                    {FACILITIES.map((f) => (
                      <button
                        key={f}
                        onClick={() => { setFacility(f); setFacOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13, color: f === facility ? TEAL : TEXT_PRIMARY, backgroundColor: f === facility ? '#EDF7F4' : 'transparent', cursor: 'pointer', fontWeight: f === facility ? 600 : 400 }}
                      >
                        {f}
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
                  placeholder="Search MROs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 13, color: TEXT_PRIMARY, backgroundColor: 'transparent', width: 200 }}
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
            <div className="flex items-center" style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 20px', height: 48, backgroundColor: BG_LIGHT }}>
              {[
                { label: 'MRO Name',      w: COL.name     },
                { label: 'Facility',      w: COL.facility  },
                { label: 'Type',          w: COL.type      },
                { label: 'Bays',          w: COL.bays      },
                { label: 'Parking Slots', w: COL.parking   },
                { label: 'Status',        w: COL.status    },
                { label: 'Actions',       w: COL.actions   },
              ].map(({ label, w }) => (
                <span
                  key={label}
                  style={{ width: w, fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((row, i) => {
              const s = STATUS_STYLES[row.status];
              return (
                <div
                  key={row.name}
                  className="flex items-center"
                  style={{ padding: '0 20px', height: 56, borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer' }}
                  onClick={onViewBays}
                >
                  {/* MRO Name */}
                  <div className="flex items-center gap-2" style={{ width: COL.name, flexShrink: 0 }}>
                    <Warehouse size={16} color={TEAL} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.name}</span>
                  </div>
                  {/* Facility */}
                  <div className="flex items-center gap-1.5" style={{ width: COL.facility, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: row.dotColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{row.facility} {row.facilityCode}</span>
                  </div>
                  {/* Type */}
                  <span style={{ width: COL.type, fontSize: 13, color: TEXT_PRIMARY, flexShrink: 0 }}>{row.type}</span>
                  {/* Bays */}
                  <span style={{ width: COL.bays, fontSize: 13, color: TEXT_PRIMARY, flexShrink: 0 }}>{row.bays}</span>
                  {/* Parking Slots */}
                  <div className="flex items-center gap-1.5" style={{ width: COL.parking, flexShrink: 0 }}>
                    {row.avatar && (
                      <div className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: row.avatar.color }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{row.avatar.initial}</span>
                      </div>
                    )}
                    <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{row.parking}</span>
                  </div>
                  {/* Status */}
                  <div style={{ width: COL.status, flexShrink: 0 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
                      {row.status}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1" style={{ width: COL.actions, flexShrink: 0 }}>
                    <button style={{ padding: 6, borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onViewBays?.(); }}>
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
            <div className="flex items-center justify-between" style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
              <span style={{ fontSize: 13, color: TEXT_MUTED }}>Showing 1–{filtered.length} of {ALL_ROWS.length} MROs</span>
              <div className="flex items-center gap-1">
                <button style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={14} color={TEXT_SECONDARY} />
                </button>
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${n === 1 ? TEAL : BORDER}`, backgroundColor: n === 1 ? TEAL : '#FFFFFF', cursor: 'pointer', fontSize: 13, fontWeight: n === 1 ? 600 : 500, color: n === 1 ? '#FFFFFF' : TEXT_SECONDARY }}
                  >
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

// ── Mobile ──────────────────────────────────────────────────────────

function MobileLayout({ onDashboard, onFacilities, onChats, onBookings, onViewBays }: Props) {
  const [activeTab, setActiveTab] = useState<TabFilter>('All MROs');

  const filtered = ALL_ROWS.filter((r) => activeTab === 'All MROs' || r.status === activeTab);

  const tabs: { key: NavKey; Icon: React.ElementType; label: string; active: boolean; onClick?: () => void }[] = [
    { key: 'dashboard',  Icon: LayoutDashboard, label: 'HOME',       active: false, onClick: onDashboard },
    { key: 'manager',    Icon: CalendarDays,     label: 'SLOTS',      active: true,  onClick: undefined },
    { key: 'chats',      Icon: MessageCircle,    label: 'MESSAGES',   active: false, onClick: onChats },
    { key: 'bookings',   Icon: Plane,            label: 'SAVED',      active: false, onClick: onBookings },
    { key: 'facilities', Icon: Building2,        label: 'FACILITIES', active: false, onClick: onFacilities },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 430, height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: BG_LIGHT, fontFamily: 'Inter, system-ui, sans-serif', margin: '0 auto', overflow: 'hidden' }}>

      {/* Status bar */}
      <div style={{ height: 62, backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 0', flexShrink: 0 }}>
        <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Signal size={16} color="#FFFFFF" />
          <Wifi size={16} color="#FFFFFF" />
          <BatteryFull size={16} color="#FFFFFF" />
        </div>
      </div>

      {/* Header */}
      <div style={{ backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
        <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700 }}>MRO Manager</span>
        <button
          onClick={onViewBays}
          style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: TEAL, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={14} />
          Add Bay
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ backgroundColor: '#FFFFFF', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
        {(['All MROs', 'Active', 'Under Maintenance', 'Inactive'] as TabFilter[]).map((t) => {
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

      {/* MRO cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 100 }}>
        {filtered.map((row) => {
          const s = STATUS_STYLES[row.status];
          return (
            <button
              key={row.name}
              onClick={onViewBays}
              style={{ width: '100%', textAlign: 'left', backgroundColor: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}
            >
              {/* Top: name + status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>{row.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: row.dotColor }} />
                    <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.facility} {row.facilityCode}</span>
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
                  {row.status}
                </span>
              </div>
              {/* Divider */}
              <div style={{ height: 1, backgroundColor: BORDER }} />
              {/* Bottom: type + bays + parking */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Warehouse size={13} color={TEXT_MUTED} />
                  <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.bays} bays</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {row.avatar && (
                    <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: row.avatar.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#FFFFFF' }}>{row.avatar.initial}</span>
                    </div>
                  )}
                  <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{row.parking} slots</span>
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED, flex: 1, textAlign: 'right' }}>{row.type}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom tab bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BORDER}`, padding: '12px 21px 21px', flexShrink: 0 }}>
        <div style={{ backgroundColor: BG_LIGHT, borderRadius: 36, height: 62, padding: 4, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 2 }}>
          {tabs.map(({ key, Icon, label, active, onClick }) => (
            <button
              key={key}
              onClick={onClick}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, height: '100%', borderRadius: 26, backgroundColor: active ? TEAL : 'transparent', border: 'none', cursor: onClick ? 'pointer' : 'default' }}
            >
              <Icon size={18} color={active ? '#FFFFFF' : TEXT_MUTED} />
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5, color: active ? '#FFFFFF' : TEXT_MUTED }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
