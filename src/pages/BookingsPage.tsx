import { useState } from 'react';
import {
  LayoutDashboard, Building2, CalendarDays, MessageCircle, Plane, Settings,
  Bell, Download, Plus, Search, SlidersHorizontal,
  CalendarCheck, Wrench, TrendingUp, Clock3,
  Pencil, EllipsisVertical, ChevronLeft, ChevronRight,
  List, Calendar, Warehouse, ChevronDown,
} from 'lucide-react';

const NAVY         = '#1C2B4A';
const TEAL         = '#57A091';
const TEAL_HOVER   = '#478A7C';
const BG_LIGHT     = '#F5F7FA';
const BLUE_LIGHT   = '#EDF7F4';
const BORDER       = '#E2E8F0';
const TEXT_PRIMARY   = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED     = '#94A3B8';
const GREEN        = '#22C55E';

// ── Types ─────────────────────────────────────────────────────────────

type NavKey    = 'dashboard' | 'facilities' | 'manager' | 'chats' | 'bookings' | 'settings';
type Status    = 'In Progress' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Upcoming';
type TabFilter = 'All Bookings' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
type View      = 'list' | 'calendar';

// ── Constants ─────────────────────────────────────────────────────────

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard'   },
  { key: 'facilities', icon: Building2,        label: 'Facilities'  },
  { key: 'manager',    icon: CalendarDays,     label: 'MRO Manager' },
  { key: 'chats',      icon: MessageCircle,    label: 'Chats', badge: 3 },
  { key: 'bookings',   icon: Plane,            label: 'Bookings'    },
  { key: 'settings',   icon: Settings,         label: 'Settings'    },
];

const STAT_CARDS = [
  { label: 'Total Bookings', value: '156',      sub: '+12% vs last month', subColor: GREEN,          Icon: CalendarCheck, iconBg: '#EDF7F4', iconColor: TEAL      },
  { label: 'Active',         value: '23',       sub: 'In maintenance',     subColor: GREEN,          Icon: Wrench,        iconBg: '#F0FDF4', iconColor: GREEN     },
  { label: 'Revenue',        value: '€185,400', sub: '+12% vs last month', subColor: GREEN,          Icon: TrendingUp,    iconBg: '#F0FDF4', iconColor: GREEN     },
  { label: 'Upcoming',       value: '34',       sub: 'Next 30 days',       subColor: TEXT_SECONDARY, Icon: Clock3,        iconBg: '#FEF3C7', iconColor: '#F59E0B' },
];

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  'In Progress': { bg: '#E0F2FE', color: '#0369A1' },
  'Confirmed':   { bg: '#F0FDF4', color: '#16A34A' },
  'Completed':   { bg: '#F1F5F9', color: '#64748B' },
  'Cancelled':   { bg: '#FEE2E2', color: '#DC2626' },
  'Upcoming':    { bg: '#FEF3C7', color: '#D97706' },
};

const PILL_COLOR: Record<Status, string> = {
  'In Progress': TEAL,
  'Confirmed':   '#22C55E',
  'Completed':   '#64748B',
  'Cancelled':   '#DC2626',
  'Upcoming':    '#F59E0B',
};

const TABS: TabFilter[] = ['All Bookings', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const BAYS     = ['All Bays','Bay A-1','Bay A-2','Bay B-1','Bay B-2','Bay C-1','Bay C-2','Bay D-1'];

const D = (y: number, m: number, d: number) => new Date(y, m - 1, d);

interface BookingRow {
  id: string;
  operator: string;
  dotColor: string | null;
  schedule: string;
  amount: string;
  bay: string;
  status: Status;
  start: Date;
  end: Date;
}

const ALL_ROWS: BookingRow[] = [
  { id: 'BK-2401', operator: 'Lufthansa',       dotColor: '#22C55E', schedule: 'Apr 25 – 28, 2026',    amount: '€50,000',  bay: 'Bay A-1', status: 'In Progress', start: D(2026,4,25), end: D(2026,4,28) },
  { id: 'BK-2402', operator: 'Ryanair',          dotColor: '#0369A1', schedule: 'Apr 22 – 24, 2026',    amount: '€18,000',  bay: 'Bay B-1', status: 'Confirmed',   start: D(2026,4,22), end: D(2026,4,24) },
  { id: 'BK-2403', operator: 'Turkish Airlines', dotColor: '#F59E0B', schedule: 'Apr 21 – 25, 2026',    amount: '€85,000',  bay: 'Bay B-2', status: 'Completed',   start: D(2026,4,21), end: D(2026,4,25) },
  { id: 'BK-2404', operator: 'Delta Airlines',   dotColor: null,      schedule: 'Apr 28 – May 2, 2026', amount: '€71,000',  bay: 'Bay C-2', status: 'Confirmed',   start: D(2026,4,28), end: D(2026,5,2)  },
  { id: 'BK-2405', operator: 'EasyJet',          dotColor: '#22C55E', schedule: 'May 3 – 4, 2026',      amount: '€9,500',   bay: 'Bay A-2', status: 'Cancelled',   start: D(2026,5,3),  end: D(2026,5,4)  },
  { id: 'BK-2406', operator: 'Emirates',         dotColor: '#0369A1', schedule: 'May 5 – 15, 2026',     amount: '€150,000', bay: 'Bay A-1', status: 'Upcoming',    start: D(2026,5,5),  end: D(2026,5,15) },
  { id: 'BK-2407', operator: 'Swiss Air',        dotColor: '#22C55E', schedule: 'Apr 10 – 18, 2026',    amount: '€45,200',  bay: 'Bay C-1', status: 'Completed',   start: D(2026,4,10), end: D(2026,4,18) },
];

const COL = { id: 100, operator: 180, schedule: 160, amount: 110, bay: 140, status: 110, actions: 80 };

// ── Calendar helpers ───────────────────────────────────────────────────

function buildCalendarGrid(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const dow = firstDay.getDay(); // 0=Sun
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const start = new Date(year, month, 1 + mondayOffset);
  const weeks: Date[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < 5; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function toDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function getBookingsForDay(date: Date, rows: BookingRow[]): BookingRow[] {
  const t = toDay(date);
  return rows.filter(r => t >= toDay(r.start) && t <= toDay(r.end));
}

// ── Component ─────────────────────────────────────────────────────────

export default function BookingsPage({
  onDashboard, onChats, onManager, onViewBooking, onFacilities,
}: {
  onDashboard?:   () => void;
  onChats?:       () => void;
  onManager?:     () => void;
  onViewBooking?: () => void;
  onFacilities?:  () => void;
}) {
  const today = new Date();

  const [view, setView]               = useState<View>('list');
  const [activeTab, setActiveTab]     = useState<TabFilter>('All Bookings');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [calYear, setCalYear]         = useState(today.getFullYear());
  const [calMonth, setCalMonth]       = useState(today.getMonth());
  const [selectedBay, setSelectedBay] = useState('All Bays');
  const [showBayMenu, setShowBayMenu] = useState(false);

  const filtered = ALL_ROWS.filter(r => {
    const matchesTab    = activeTab === 'All Bookings' || r.status === activeTab;
    const q             = searchQuery.toLowerCase();
    const matchesSearch = !q || r.id.toLowerCase().includes(q) || r.operator.toLowerCase().includes(q) || r.bay.toLowerCase().includes(q);
    const matchesBay    = selectedBay === 'All Bays' || r.bay === selectedBay;
    return matchesTab && matchesSearch && matchesBay;
  });

  function handleNav(key: NavKey) {
    if (key === 'dashboard')  onDashboard?.();
    if (key === 'chats')      onChats?.();
    if (key === 'manager')    onManager?.();
    if (key === 'facilities') onFacilities?.();
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  const calGrid = buildCalendarGrid(calYear, calMonth);

  return (
    <div className="flex overflow-hidden" style={{ height: '100vh', backgroundColor: BG_LIGHT }}
      onClick={() => showBayMenu && setShowBayMenu(false)}>

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
                  style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent' }}
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
        <div className="flex items-center justify-between shrink-0"
          style={{ height: 64, backgroundColor: '#FFFFFF', borderBottom: `1px solid ${BORDER}`, padding: '0 28px' }}>
          <div className="flex flex-col gap-0.5">
            <span style={{ fontFamily: 'Inter', fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>Bookings</span>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY }}>Manage all maintenance bookings</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} color={TEXT_SECONDARY} style={{ cursor: 'pointer' }} />

            {/* List / Calendar toggle */}
            <div className="flex" style={{ borderRadius: 8, border: `1px solid ${BORDER}` }}>
              <button
                onClick={() => setView('list')}
                className="flex items-center justify-center"
                style={{ padding: '8px 10px', borderRadius: '7px 0 0 7px', border: 'none', cursor: 'pointer', backgroundColor: view === 'list' ? TEAL : '#FFFFFF' }}
              >
                <List size={16} color={view === 'list' ? '#FFFFFF' : TEXT_MUTED} />
              </button>
              <button
                onClick={() => setView('calendar')}
                className="flex items-center justify-center"
                style={{ padding: '8px 10px', borderRadius: '0 7px 7px 0', border: 'none', cursor: 'pointer', backgroundColor: view === 'calendar' ? TEAL : '#FFFFFF' }}
              >
                <Calendar size={16} color={view === 'calendar' ? '#FFFFFF' : TEXT_MUTED} />
              </button>
            </div>

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
            <div key={label} className="flex flex-col gap-2.5"
              style={{ padding: 20, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}` }}>
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

        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <div className="flex-1 flex flex-col min-h-0" style={{ padding: '0 28px 20px', gap: 16 }}>

            {/* Filter bar */}
            <div className="flex items-center justify-between shrink-0" style={{ padding: '16px 0' }}>
              <div className="flex items-center gap-2">
                {TABS.map(tab => {
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
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2"
                  style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', width: 240 }}>
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
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden"
              style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>

              {/* Header row */}
              <div className="flex items-center shrink-0"
                style={{ height: 48, backgroundColor: BG_LIGHT, borderBottom: `1px solid ${BORDER}`, padding: '0 20px' }}>
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
                    const st     = STATUS_STYLES[row.status];
                    const isLast = idx === filtered.length - 1;
                    return (
                      <div
                        key={row.id}
                        className="flex items-center"
                        style={{ height: 56, padding: '0 20px', borderBottom: isLast ? 'none' : `1px solid ${BORDER}`, cursor: 'pointer' }}
                        onClick={onViewBooking}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG_LIGHT)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                      >
                        <span style={{ width: COL.id, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.id}</span>
                        <div className="flex items-center gap-1.5" style={{ width: COL.operator, flexShrink: 0 }}>
                          {row.dotColor && <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: row.dotColor, flexShrink: 0 }} />}
                          <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{row.operator}</span>
                        </div>
                        <span style={{ width: COL.schedule, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY }}>{row.schedule}</span>
                        <span style={{ width: COL.amount, flexShrink: 0, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.amount}</span>
                        <span style={{ flex: 1, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{row.bay}</span>
                        <div style={{ width: COL.status, flexShrink: 0 }}>
                          <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 999, backgroundColor: st.bg }}>
                            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: st.color }}>{row.status}</span>
                          </div>
                        </div>
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
              <div className="flex items-center justify-between shrink-0"
                style={{ height: 52, padding: '0 20px', backgroundColor: BG_LIGHT, borderTop: `1px solid ${BORDER}` }}>
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
        )}

        {/* ── CALENDAR VIEW ── */}
        {view === 'calendar' && (
          <div className="flex-1 flex flex-col min-h-0" style={{ padding: '0 28px 20px', gap: 16 }}>

            {/* Filter bar */}
            <div className="flex items-center justify-between shrink-0" style={{ padding: '16px 0' }}>
              <div className="flex items-center gap-2">
                {TABS.map(tab => {
                  const active = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                        border: active ? 'none' : `1px solid ${BORDER}`,
                        backgroundColor: active ? TEAL : '#FFFFFF',
                        fontFamily: 'Inter', fontSize: 13, fontWeight: active ? 600 : 500,
                        color: active ? '#FFFFFF' : TEXT_SECONDARY,
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2"
                  style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', width: 240 }}>
                  <Search size={16} color={TEXT_MUTED} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search bookings..."
                    style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_PRIMARY, outline: 'none', border: 'none', width: '100%', backgroundColor: 'transparent' }}
                  />
                </div>

                {/* Bay filter dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    className="flex items-center gap-1.5"
                    onClick={e => { e.stopPropagation(); setShowBayMenu(v => !v); }}
                    style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, cursor: 'pointer' }}
                  >
                    <Warehouse size={16} color={TEXT_SECONDARY} />
                    {selectedBay}
                    <ChevronDown size={14} color={TEXT_MUTED} />
                  </button>
                  {showBayMenu && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF', zIndex: 20, minWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    >
                      {BAYS.map(bay => (
                        <button
                          key={bay}
                          onClick={() => { setSelectedBay(bay); setShowBayMenu(false); }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', border: 'none', backgroundColor: selectedBay === bay ? BG_LIGHT : 'transparent', fontFamily: 'Inter', fontSize: 13, fontWeight: selectedBay === bay ? 600 : 400, color: selectedBay === bay ? TEAL : TEXT_PRIMARY, cursor: 'pointer' }}
                        >
                          {bay}
                        </button>
                      ))}
                    </div>
                  )}
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

            {/* Calendar panel */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden"
              style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>

              {/* Month navigation */}
              <div className="flex items-center justify-between shrink-0"
                style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}` }}>
                <button
                  onClick={prevMonth}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}
                >
                  <ChevronLeft size={20} color={TEXT_SECONDARY} />
                </button>
                <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>
                  {MONTHS[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}
                >
                  <ChevronRight size={20} color={TEXT_SECONDARY} />
                </button>
              </div>

              {/* Weekday header */}
              <div className="flex shrink-0" style={{ borderBottom: `1px solid ${BORDER}`, padding: '10px 0' }}>
                {WEEKDAYS.map(wd => (
                  <div key={wd} style={{ flex: 1, textAlign: 'center', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>
                    {wd}
                  </div>
                ))}
              </div>

              {/* Grid — background acts as 1px separator between cells */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ backgroundColor: BORDER, gap: 1 }}>
                {calGrid.map((week, wi) => (
                  <div key={wi} className="flex flex-1 min-h-0" style={{ gap: 1 }}>
                    {week.map((date, di) => {
                      const isThisMonth = date.getMonth() === calMonth;
                      const isToday     = toDay(date) === toDay(today);
                      const dayBookings = getBookingsForDay(date, filtered);
                      const visible     = dayBookings.slice(0, 2);
                      const overflow    = dayBookings.length - 2;
                      return (
                        <div
                          key={di}
                          className="flex flex-col flex-1 min-w-0 overflow-hidden"
                          style={{
                            padding: '6px 8px',
                            gap: 4,
                            backgroundColor: isToday ? BLUE_LIGHT : isThisMonth ? '#FFFFFF' : BG_LIGHT,
                          }}
                        >
                          <span style={{
                            fontFamily: 'Inter', fontSize: 13,
                            fontWeight: isToday ? 600 : 500,
                            color: isToday ? TEAL : isThisMonth ? TEXT_PRIMARY : TEXT_MUTED,
                            flexShrink: 0,
                          }}>
                            {date.getDate()}
                          </span>
                          {visible.map(b => (
                            <div
                              key={b.id}
                              className="flex items-center overflow-hidden"
                              style={{ height: 20, borderRadius: 4, padding: '0 6px', backgroundColor: PILL_COLOR[b.status], flexShrink: 0, cursor: 'pointer' }}
                              onClick={onViewBooking}
                            >
                              <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 500, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {b.bay} · {b.operator}
                              </span>
                            </div>
                          ))}
                          {overflow > 0 && (
                            <span style={{ fontFamily: 'Inter', fontSize: 10, color: TEXT_MUTED, flexShrink: 0 }}>
                              +{overflow} more
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Pagination button ──────────────────────────────────────────────────

function PagerBtn({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
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
