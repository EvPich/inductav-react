import { useState, useEffect } from 'react';
import {
  LayoutDashboard, CalendarDays, MessageCircle, Plane, Settings,
  Download, Plus, Search, SlidersHorizontal, Warehouse,
  Pencil, EllipsisVertical, ChevronLeft, ChevronRight, ChevronDown,
  Calendar, Wrench, Bookmark, Signal, Wifi, BatteryFull,
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

// ── Shared types & data ─────────────────────────────────────────────

type NavKey = 'dashboard' | 'manager' | 'chats' | 'bookings' | 'settings';
type TabFilter = 'All Bays' | 'Available' | 'Booked' | 'Blocked';
type BayStatus = 'Available' | 'Booked' | 'Blocked';

const TABS: TabFilter[] = ['All Bays', 'Available', 'Booked', 'Blocked'];

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'manager',   icon: CalendarDays,    label: 'MRO Manager' },
  { key: 'chats',     icon: MessageCircle,   label: 'Chats', badge: 3 },
  { key: 'bookings',  icon: Plane,           label: 'Bookings' },
  { key: 'settings',  icon: Settings,        label: 'Settings' },
];

// ── Desktop data ────────────────────────────────────────────────────

const DESKTOP_STATUS_STYLES: Record<BayStatus, { bg: string; color: string }> = {
  Available: { bg: '#F0FDF4', color: '#16A34A' },
  Booked:    { bg: '#E0F2FE', color: '#0369A1' },
  Blocked:   { bg: '#FEE2E2', color: '#DC2626' },
};

interface Row {
  bay: string;
  type: string;
  dotColor: string;
  dates: string;
  price: string;
  op: { initials: string; color: string; name: string } | null;
  status: BayStatus;
}

const ALL_ROWS: Row[] = [
  { bay: 'Bay A-1', type: 'C-Check',            dotColor: '#22C55E', dates: 'Apr 25 – Apr 28, 2026', price: '€12,500', op: null,                                                    status: 'Available' },
  { bay: 'Bay A-2', type: 'Engine Overhaul',     dotColor: '#0369A1', dates: 'Apr 21 – Apr 24, 2026', price: '€15,000', op: { initials: 'R', color: '#009DE0', name: 'Ryanair'         }, status: 'Booked'    },
  { bay: 'Bay B-1', type: 'Cabin Refurbishment', dotColor: '#F59E0B', dates: 'Apr 26 – Apr 30, 2026', price: '€8,200',  op: null,                                                    status: 'Available' },
  { bay: 'Bay B-2', type: 'Heavy Maintenance',   dotColor: '#DC2626', dates: 'Apr 22 – Apr 25, 2026', price: '€18,000', op: { initials: 'T', color: '#DC2626', name: 'Turkish Airlines' }, status: 'Blocked'   },
  { bay: 'Bay C-1', type: 'A-Check',             dotColor: '#22C55E', dates: 'May 1 – May 5, 2026',   price: '€9,800',  op: null,                                                    status: 'Available' },
  { bay: 'Bay C-2', type: 'Engine Inspection',   dotColor: '#0369A1', dates: 'Apr 28 – May 2, 2026',  price: '€11,200', op: { initials: 'D', color: '#F59E0B', name: 'Delta Airlines'   }, status: 'Booked'    },
  { bay: 'Bay A-1', type: 'Line Maintenance',    dotColor: '#22C55E', dates: 'May 3 – May 4, 2026',   price: '€6,500',  op: { initials: 'E', color: '#22C55E', name: 'EasyJet'           }, status: 'Booked'    },
];

const COL_WIDTHS = { bay: 100, type: 200, dates: 168, price: 110, op: 160, status: 110, actions: 80 };

// ── Mobile data ─────────────────────────────────────────────────────

const MOBILE_STATUS_STYLES: Record<BayStatus, { bg: string; color: string }> = {
  Available: { bg: '#F0FDF4', color: '#22C55E' },
  Booked:    { bg: '#EDF7F4', color: '#57A091' },
  Blocked:   { bg: '#FEF2F2', color: '#EF4444' },
};

interface BayCard {
  name: string;
  status: BayStatus;
  dates: string;
  type: string;
  price: string;
  operator?: string;
}

const BAY_CARDS: BayCard[] = [
  { name: 'Bay A-1', status: 'Available', dates: 'Apr 25–28', type: 'C-Check',          price: '€12,500/day' },
  { name: 'Bay A-2', status: 'Booked',    dates: 'Apr 21–24', type: 'Engine Overhaul',  price: '€15,000/day', operator: 'Ryanair' },
  { name: 'Bay B-1', status: 'Available', dates: 'Apr 26–30', type: 'Cabin Refurb',      price: '€8,200/day'  },
  { name: 'Bay B-2', status: 'Blocked',   dates: 'Apr 22–25', type: 'Heavy Maintenance', price: '€18,000/day' },
  { name: 'Bay C-1', status: 'Available', dates: 'May 1–5',   type: 'A-Check',           price: '€9,800/day'  },
];

// ── Main component ──────────────────────────────────────────────────

export default function MROManagerPage({
  onDashboard, onChats, onViewBooking, onBookings,
}: {
  onDashboard?: () => void;
  onChats?: () => void;
  onViewBooking?: () => void;
  onBookings?: () => void;
}) {
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState<TabFilter>('All Bays');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ALL_ROWS.filter((r) => {
    const matchesTab = activeTab === 'All Bays' || r.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || r.bay.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || (r.op?.name.toLowerCase().includes(q) ?? false);
    return matchesTab && matchesSearch;
  });

  if (isMobile) {
    return (
      <MobileLayout
        activeFilter={activeTab}
        onFilterChange={setActiveTab}
        onDashboard={onDashboard}
        onChats={onChats}
        onViewBooking={onViewBooking}
        onBookings={onBookings}
      />
    );
  }

  return (
    <div className="flex overflow-hidden" style={{ height: '100vh', backgroundColor: BG_LIGHT }}>

      {/* ── Sidebar ── */}
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
                  onClick={() => {
                    if (key === 'dashboard') onDashboard?.();
                    if (key === 'chats') onChats?.();
                    if (key === 'bookings') onBookings?.();
                  }}
                  className="flex items-center justify-between w-full text-left"
                  style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} color={active ? '#FFFFFF' : TEXT_MUTED} />
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: active ? 600 : 500, color: active ? '#FFFFFF' : TEXT_MUTED }}>{label}</span>
                  </div>
                  {badge && (
                    <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#EF4444' }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{badge}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: TEAL }}>
            <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>LT</span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Lufthansa Technik</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, color: TEXT_MUTED }}>MRO Admin</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between shrink-0" style={{ height: 64, backgroundColor: '#FFFFFF', borderBottom: `1px solid ${BORDER}`, padding: '0 28px' }}>
          <div className="flex flex-col gap-0.5">
            <span style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>MRO Manager</span>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: TEXT_SECONDARY }}>Manage and configure your maintenance bay slots</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, cursor: 'pointer' }}
            >
              <Download size={16} color={TEXT_SECONDARY} />
              Export
            </button>
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: TEAL, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Plus size={16} color="#FFFFFF" />
              Create a Booking
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between shrink-0" style={{ padding: '16px 28px', borderBottom: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                  style={{
                    padding: '8px 16px', borderRadius: 20, cursor: 'pointer', border: active ? 'none' : `1px solid ${BORDER}`,
                    backgroundColor: active ? TEAL : '#FFFFFF',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: active ? 600 : 500,
                    color: active ? '#FFFFFF' : TEXT_SECONDARY,
                    transition: 'background-color 0.15s',
                  }}
                >
                  {tab}
                </button>
              );
            })}
            <button
              className="flex items-center gap-1.5"
              style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY, cursor: 'pointer' }}
            >
              Filter by Bay
              <ChevronDown size={14} color={TEXT_SECONDARY} />
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', width: 240 }}>
              <Search size={16} color={TEXT_MUTED} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search bays..."
                style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_PRIMARY, outline: 'none', border: 'none', width: '100%', backgroundColor: 'transparent' }}
              />
            </div>
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, cursor: 'pointer' }}
            >
              <SlidersHorizontal size={16} color={TEXT_SECONDARY} />
              Filters
            </button>
            <button
              className="flex items-center gap-1.5"
              style={{ padding: '8px 16px', borderRadius: 6, backgroundColor: TEAL, fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#FFFFFF', cursor: 'pointer', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Plus size={16} color="#FFFFFF" />
              Add Bay
            </button>
          </div>
        </div>

        {/* Table area */}
        <div className="flex-1 flex flex-col min-h-0" style={{ padding: '20px 28px' }}>
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden" style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>

            {/* Table header */}
            <div className="flex items-center shrink-0" style={{ height: 48, backgroundColor: BG_LIGHT, borderBottom: `1px solid ${BORDER}`, padding: '0 20px' }}>
              <span style={{ width: COL_WIDTHS.bay,     flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Bay</span>
              <span style={{ width: COL_WIDTHS.type,    flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Maintenance Type</span>
              <span style={{ width: COL_WIDTHS.dates,   flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Date Range</span>
              <span style={{ width: COL_WIDTHS.price,   flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Price/Day</span>
              <span style={{ flex: 1,                                   fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Operator</span>
              <span style={{ width: COL_WIDTHS.status,  flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Status</span>
              <span style={{ width: COL_WIDTHS.actions, flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Actions</span>
            </div>

            {/* Rows */}
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center flex-1">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_MUTED }}>No bays match the current filter.</span>
                </div>
              ) : (
                filtered.map((row, idx) => {
                  const st = DESKTOP_STATUS_STYLES[row.status];
                  const isLast = idx === filtered.length - 1;
                  return (
                    <div
                      key={idx}
                      className="flex items-center"
                      style={{ height: 56, padding: '0 20px', borderBottom: isLast ? 'none' : `1px solid ${BORDER}`, cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG_LIGHT)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <div className="flex items-center gap-2" style={{ width: COL_WIDTHS.bay, flexShrink: 0 }}>
                        <Warehouse size={16} color={TEAL} />
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.bay}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ width: COL_WIDTHS.type, flexShrink: 0 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: row.dotColor, flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{row.type}</span>
                      </div>
                      <span style={{ width: COL_WIDTHS.dates, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY }}>{row.dates}</span>
                      <span style={{ width: COL_WIDTHS.price, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.price}</span>
                      <div className="flex items-center gap-1.5" style={{ flex: 1 }}>
                        {row.op ? (
                          <>
                            <div className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: row.op.color }}>
                              <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{row.op.initials}</span>
                            </div>
                            <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{row.op.name}</span>
                          </>
                        ) : (
                          <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_MUTED }}>—</span>
                        )}
                      </div>
                      <div style={{ width: COL_WIDTHS.status, flexShrink: 0 }}>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 999, backgroundColor: st.bg }}>
                          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: st.color }}>{row.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" style={{ width: COL_WIDTHS.actions, flexShrink: 0 }}>
                        <button
                          onClick={e => { e.stopPropagation(); onViewBooking?.(); }}
                          style={{ padding: 4, borderRadius: 4, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                        >
                          <Pencil size={16} color={TEXT_MUTED} />
                        </button>
                        <button style={{ padding: 4, borderRadius: 4, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                          <EllipsisVertical size={16} color={TEXT_MUTED} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between shrink-0" style={{ height: 52, padding: '0 20px', backgroundColor: BG_LIGHT, borderTop: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_MUTED }}>Showing 1–7 of 24 slots</span>
              <div className="flex items-center gap-1">
                <PageBtn onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft size={16} color={TEXT_SECONDARY} />
                </PageBtn>
                {[1, 2, 3, 4].map((p) => (
                  <PageBtn key={p} active={currentPage === p} onClick={() => setCurrentPage(p)}>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: currentPage === p ? 600 : 500, color: currentPage === p ? '#FFFFFF' : TEXT_SECONDARY }}>
                      {p}
                    </span>
                  </PageBtn>
                ))}
                <PageBtn onClick={() => setCurrentPage(p => Math.min(4, p + 1))}>
                  <ChevronRight size={16} color={TEXT_SECONDARY} />
                </PageBtn>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile layout ───────────────────────────────────────────────────

function MobileLayout({ activeFilter, onFilterChange, onDashboard, onChats, onViewBooking, onBookings }: {
  activeFilter: TabFilter;
  onFilterChange: (f: TabFilter) => void;
  onDashboard?: () => void;
  onChats?: () => void;
  onViewBooking?: () => void;
  onBookings?: () => void;
}) {
  const filtered = activeFilter === 'All Bays'
    ? BAY_CARDS
    : BAY_CARDS.filter(c => c.status === activeFilter);

  return (
    <div style={{ width: '100%', maxWidth: 430, height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: BG_LIGHT, fontFamily: 'Inter, system-ui, sans-serif', margin: '0 auto', overflow: 'hidden' }}>

      {/* Status bar */}
      <div style={{ height: 62, backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Signal size={16} color="#FFFFFF" />
          <Wifi size={16} color="#FFFFFF" />
          <BatteryFull size={16} color="#FFFFFF" />
        </div>
      </div>

      {/* Navy header */}
      <div style={{ backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px', flexShrink: 0 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>MRO Manager</span>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: TEAL, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} />
          Add Bay
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', overflowX: 'auto', flexShrink: 0 }}>
        {TABS.map(tab => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => onFilterChange(tab)}
              style={{
                position: 'relative', padding: '12px 16px', border: 'none', background: 'none',
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                color: isActive ? TEAL : TEXT_SECONDARY,
              }}
            >
              {tab}
              {isActive && (
                <span style={{ position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: TEAL, borderRadius: 2 }} />
              )}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 16, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, cursor: 'pointer', flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>Filter by Bay</span>
          <ChevronDown size={12} color={TEXT_SECONDARY} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: BORDER, flexShrink: 0 }} />

      {/* Scrollable card list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <span style={{ fontSize: 14, color: TEXT_MUTED }}>No bays match this filter.</span>
          </div>
        ) : (
          filtered.map(card => (
            <MobileBayCard
              key={card.name + card.type}
              card={card}
              onPress={card.status === 'Booked' ? onViewBooking : undefined}
            />
          ))
        )}
        <div style={{ height: 4 }} />
      </div>

      {/* Bottom tab bar */}
      <MobileTabBar onHome={onDashboard} onMessages={onChats} onSaved={onBookings} />
    </div>
  );
}

function MobileBayCard({ card, onPress }: { card: BayCard; onPress?: () => void }) {
  const s = MOBILE_STATUS_STYLES[card.status];
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        width: '100%', textAlign: 'left',
        padding: 16, borderRadius: 12,
        backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
        cursor: onPress ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>{card.name}</span>
        <div style={{ padding: '4px 10px', borderRadius: 12, backgroundColor: s.bg }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{card.status}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={14} color={TEXT_MUTED} />
          <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>{card.dates}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Wrench size={14} color={TEXT_MUTED} />
          <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>{card.type}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: card.operator ? 'space-between' : 'flex-end', width: '100%' }}>
        {card.operator && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plane size={14} color={TEXT_MUTED} />
            <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>{card.operator}</span>
          </div>
        )}
        <span style={{ fontSize: 15, fontWeight: 700, color: TEAL }}>{card.price}</span>
      </div>
    </button>
  );
}

function MobileTabBar({ onHome, onMessages, onSaved }: { onHome?: () => void; onMessages?: () => void; onSaved?: () => void }) {
  const tabs = [
    { key: 'home',     label: 'HOME',     icon: <LayoutDashboard size={18} />, active: false, handler: onHome },
    { key: 'slots',    label: 'SLOTS',    icon: <Calendar size={18} />,        active: true,  handler: undefined as (() => void) | undefined },
    { key: 'messages', label: 'MESSAGES', icon: <MessageCircle size={18} />,   active: false, handler: onMessages, badge: true },
    { key: 'saved',    label: 'SAVED',    icon: <Bookmark size={18} />,        active: false, handler: onSaved },
    { key: 'settings', label: 'SETTINGS', icon: <Settings size={18} />,        active: false, handler: undefined },
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BORDER}`, padding: '12px 21px 21px', flexShrink: 0 }}>
      <div style={{ backgroundColor: BG_LIGHT, borderRadius: 36, height: 62, padding: 4, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        {tabs.map(({ key, label, icon, active, handler, badge }) => (
          <button
            key={key}
            onClick={handler}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, height: '100%', borderRadius: 26, backgroundColor: active ? TEAL : 'transparent', border: 'none', cursor: handler ? 'pointer' : 'default', position: 'relative', padding: '0 2px' }}
          >
            <span style={{ color: active ? '#FFFFFF' : TEXT_MUTED, position: 'relative', display: 'flex' }}>
              {icon}
              {badge && !active && (
                <span style={{ position: 'absolute', top: -2, right: -3, width: 7, height: 7, borderRadius: '50%', backgroundColor: '#EF4444', border: '1.5px solid white' }} />
              )}
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5, color: active ? '#FFFFFF' : TEXT_MUTED }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Pagination button ───────────────────────────────────────────────

function PageBtn({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{ width: 32, height: 32, borderRadius: 6, cursor: 'pointer', border: active ? 'none' : `1px solid ${BORDER}`, backgroundColor: active ? TEAL : '#FFFFFF' }}
    >
      {children}
    </button>
  );
}
