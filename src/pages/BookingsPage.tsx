import { useState } from 'react';
import {
  LayoutDashboard, CalendarDays, MessageCircle, Plane, Settings,
  Bell, Download, Plus, Search, SlidersHorizontal,
  CalendarCheck, Wrench, TrendingUp, Clock3,
  Pencil, EllipsisVertical, ChevronLeft, ChevronRight,
} from 'lucide-react';

const NAVY    = '#1C2B4A';
const TEAL    = '#57A091';
const TEAL_HOVER = '#478A7C';
const BG_LIGHT = '#F5F7FA';
const BORDER  = '#E2E8F0';
const TEXT_PRIMARY   = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED     = '#94A3B8';
const GREEN   = '#22C55E';

// ── Types ─────────────────────────────────────────────────────────────

type NavKey    = 'dashboard' | 'manager' | 'chats' | 'bookings' | 'settings';
type Status    = 'In Progress' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Upcoming';
type TabFilter = 'All Bookings' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

// ── Constants ─────────────────────────────────────────────────────────

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'   },
  { key: 'manager',   icon: CalendarDays,    label: 'MRO Manager' },
  { key: 'chats',     icon: MessageCircle,   label: 'Chats', badge: 3 },
  { key: 'bookings',  icon: Plane,           label: 'Bookings'    },
  { key: 'settings',  icon: Settings,        label: 'Settings'    },
];

const STAT_CARDS = [
  { label: 'Total Bookings', value: '156',      sub: '+12% vs last month', subColor: GREEN,          Icon: CalendarCheck, iconBg: '#EDF7F4', iconColor: TEAL    },
  { label: 'Active',         value: '23',       sub: 'In maintenance',     subColor: GREEN,          Icon: Wrench,        iconBg: '#F0FDF4', iconColor: GREEN   },
  { label: 'Revenue',        value: '€185,400', sub: '+12% vs last month', subColor: GREEN,          Icon: TrendingUp,    iconBg: '#F0FDF4', iconColor: GREEN   },
  { label: 'Upcoming',       value: '34',       sub: 'Next 30 days',       subColor: TEXT_SECONDARY, Icon: Clock3,        iconBg: '#FEF3C7', iconColor: '#F59E0B' },
];

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  'In Progress': { bg: '#E0F2FE', color: '#0369A1' },
  'Confirmed':   { bg: '#F0FDF4', color: '#16A34A' },
  'Completed':   { bg: '#F1F5F9', color: '#64748B' },
  'Cancelled':   { bg: '#FEE2E2', color: '#DC2626' },
  'Upcoming':    { bg: '#FEF3C7', color: '#D97706' },
};

const TABS: TabFilter[] = ['All Bookings', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

interface BookingRow {
  id: string;
  operator: string;
  dotColor: string | null;
  schedule: string;
  amount: string;
  bay: string;
  status: Status;
}

const ALL_ROWS: BookingRow[] = [
  { id: 'BK-2401', operator: 'Lufthansa',       dotColor: '#22C55E', schedule: 'Apr 25 – 28, 2026',   amount: '€50,000',  bay: 'Bay A-1', status: 'In Progress' },
  { id: 'BK-2402', operator: 'Ryanair',          dotColor: '#0369A1', schedule: 'Apr 22 – 24, 2026',   amount: '€18,000',  bay: 'Bay B-1', status: 'Confirmed'   },
  { id: 'BK-2403', operator: 'Turkish Airlines', dotColor: '#F59E0B', schedule: 'Apr 21 – 25, 2026',   amount: '€85,000',  bay: 'Bay B-2', status: 'Completed'   },
  { id: 'BK-2404', operator: 'Delta Airlines',   dotColor: null,      schedule: 'Apr 28 – May 2, 2026', amount: '€71,000',  bay: 'Bay C-2', status: 'Confirmed'   },
  { id: 'BK-2405', operator: 'EasyJet',          dotColor: '#22C55E', schedule: 'May 3 – 4, 2026',     amount: '€9,500',   bay: 'Bay A-2', status: 'Cancelled'   },
  { id: 'BK-2406', operator: 'Emirates',         dotColor: '#0369A1', schedule: 'May 5 – 15, 2026',    amount: '€150,000', bay: 'Bay A-1', status: 'Upcoming'    },
  { id: 'BK-2407', operator: 'Swiss Air',        dotColor: '#22C55E', schedule: 'Apr 10 – 18, 2026',   amount: '€45,200',  bay: 'Bay C-1', status: 'Completed'   },
];

const COL = { id: 100, operator: 180, schedule: 160, amount: 110, bay: 140, status: 110, actions: 80 };

// ── Component ─────────────────────────────────────────────────────────

export default function BookingsPage({
  onDashboard, onChats, onManager, onViewBooking,
}: {
  onDashboard?:  () => void;
  onChats?:      () => void;
  onManager?:    () => void;
  onViewBooking?: () => void;
}) {
  const [activeTab, setActiveTab]       = useState<TabFilter>('All Bookings');
  const [currentPage, setCurrentPage]   = useState(1);
  const [searchQuery, setSearchQuery]   = useState('');

  const filtered = ALL_ROWS.filter((r) => {
    const matchesTab    = activeTab === 'All Bookings' || r.status === activeTab;
    const q             = searchQuery.toLowerCase();
    const matchesSearch = !q || r.id.toLowerCase().includes(q) || r.operator.toLowerCase().includes(q) || r.bay.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  function handleNav(key: NavKey) {
    if (key === 'dashboard') onDashboard?.();
    if (key === 'chats')     onChats?.();
    if (key === 'manager')   onManager?.();
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
              const active = key === 'bookings';
              return (
                <button
                  key={key}
                  onClick={() => handleNav(key)}
                  className="flex items-center justify-between w-full text-left"
                  style={{
                    padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                    backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} color={active ? '#FFFFFF' : TEXT_MUTED} />
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: active ? 600 : 500, color: active ? '#FFFFFF' : TEXT_MUTED }}>
                      {label}
                    </span>
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
            <span style={{ fontFamily: 'Inter', fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>Bookings</span>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY }}>Manage all maintenance bookings</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} color={TEXT_SECONDARY} style={{ cursor: 'pointer' }} />
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, cursor: 'pointer' }}
            >
              <Download size={16} color={TEXT_SECONDARY} />
              Export
            </button>
            <button
              className="flex items-center gap-1.5"
              style={{ padding: '10px 18px', borderRadius: 8, backgroundColor: TEAL, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Plus size={16} color="#FFFFFF" />
              Create a Booking
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 shrink-0" style={{ gap: 16, padding: '20px 28px' }}>
          {STAT_CARDS.map(({ label, value, sub, subColor, Icon, iconBg, iconColor }) => (
            <div key={label} className="flex flex-col gap-2.5" style={{ padding: 20, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>{label}</span>
                <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: iconBg }}>
                  <Icon size={18} color={iconColor} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span style={{ fontFamily: 'Inter', fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY, lineHeight: 1 }}>{value}</span>
                <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: subColor, paddingBottom: 2 }}>{sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table section */}
        <div className="flex-1 flex flex-col min-h-0" style={{ padding: '0 28px 20px', gap: 16 }}>

          {/* Filter bar */}
          <div className="flex items-center justify-between shrink-0" style={{ padding: '16px 0' }}>
            {/* Tab pills */}
            <div className="flex items-center gap-2">
              {TABS.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    style={{
                      padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                      border: active ? 'none' : `1px solid ${BORDER}`,
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
              {/* Cancelled tab (5th, styled differently — transparent bg) */}
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', width: 240 }}>
                <Search size={16} color={TEXT_MUTED} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search bookings..."
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
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>

            {/* Header */}
            <div className="flex items-center shrink-0" style={{ height: 48, backgroundColor: BG_LIGHT, borderBottom: `1px solid ${BORDER}`, padding: '0 20px' }}>
              <span style={{ width: COL.id,       flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Booking</span>
              <span style={{ width: COL.operator, flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Operator</span>
              <span style={{ width: COL.schedule, flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Schedule</span>
              <span style={{ width: COL.amount,   flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Amount</span>
              <span style={{ flex: 1,                            fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Bay</span>
              <span style={{ width: COL.status,   flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Status</span>
              <span style={{ width: COL.actions,  flexShrink: 0, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Actions</span>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center flex-1">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_MUTED }}>No bookings match the current filter.</span>
                </div>
              ) : (
                filtered.map((row, idx) => {
                  const st      = STATUS_STYLES[row.status];
                  const isLast  = idx === filtered.length - 1;
                  return (
                    <div
                      key={row.id}
                      className="flex items-center"
                      style={{ height: 56, padding: '0 20px', borderBottom: isLast ? 'none' : `1px solid ${BORDER}`, cursor: 'pointer' }}
                      onClick={onViewBooking}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG_LIGHT)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      {/* Booking ID */}
                      <span style={{ width: COL.id, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.id}</span>

                      {/* Operator */}
                      <div className="flex items-center gap-1.5" style={{ width: COL.operator, flexShrink: 0 }}>
                        {row.dotColor && (
                          <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: row.dotColor, flexShrink: 0 }} />
                        )}
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{row.operator}</span>
                      </div>

                      {/* Schedule */}
                      <span style={{ width: COL.schedule, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY }}>{row.schedule}</span>

                      {/* Amount */}
                      <span style={{ width: COL.amount, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.amount}</span>

                      {/* Bay */}
                      <span style={{ flex: 1, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.bay}</span>

                      {/* Status */}
                      <div style={{ width: COL.status, flexShrink: 0 }}>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 999, backgroundColor: st.bg }}>
                          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: st.color }}>{row.status}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2" style={{ width: COL.actions, flexShrink: 0 }}>
                        <button
                          onClick={e => { e.stopPropagation(); onViewBooking?.(); }}
                          style={{ padding: 4, borderRadius: 4, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                        >
                          <Pencil size={16} color={TEXT_MUTED} />
                        </button>
                        <button
                          onClick={e => e.stopPropagation()}
                          style={{ padding: 4, borderRadius: 4, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                        >
                          <EllipsisVertical size={16} color={TEXT_MUTED} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{ height: 52, padding: '0 20px', backgroundColor: BG_LIGHT, borderTop: `1px solid ${BORDER}` }}
            >
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_MUTED }}>Showing 1–7 of 156 bookings</span>
              <div className="flex items-center gap-1">
                <PagerBtn onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft size={16} color={TEXT_SECONDARY} />
                </PagerBtn>
                {[1, 2, 3, 4].map(p => (
                  <PagerBtn key={p} active={currentPage === p} onClick={() => setCurrentPage(p)}>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: currentPage === p ? 600 : 500, color: currentPage === p ? '#FFFFFF' : TEXT_SECONDARY }}>
                      {p}
                    </span>
                  </PagerBtn>
                ))}
                <PagerBtn onClick={() => setCurrentPage(p => Math.min(4, p + 1))}>
                  <ChevronRight size={16} color={TEXT_SECONDARY} />
                </PagerBtn>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pagination button ─────────────────────────────────────────────────

function PagerBtn({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{
        width: 32, height: 32, borderRadius: 6, cursor: 'pointer',
        border: active ? 'none' : `1px solid ${BORDER}`,
        backgroundColor: active ? TEAL : '#FFFFFF',
      }}
    >
      {children}
    </button>
  );
}
