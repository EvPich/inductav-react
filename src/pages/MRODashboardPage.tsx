import { useState, useEffect } from 'react';
import {
  LayoutDashboard, CalendarDays, MessageCircle, Plane, Settings,
  Bell, Plus, CalendarCheck, CalendarPlus, TrendingUp, Gauge,
  ChevronLeft, ChevronRight,
  Menu, Warehouse, BookOpen, Signal, Wifi, BatteryFull,
} from 'lucide-react';

const NAVY = '#1C2B4A';
const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const BLUE_LIGHT = '#EDF7F4';
const BG_LIGHT = '#F5F7FA';
const BORDER = '#E2E8F0';
const TEXT_PRIMARY = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';
const GREEN = '#22C55E';
const GREEN_LIGHT = '#DCFCE7';

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

// ── Week view types & data ──────────────────────────────────────────

type BookingColor = 'green' | 'blue' | 'yellow' | 'red';

interface Booking {
  airline: string;
  aircraft: string;
  service: string;
  days: string;
  startDay: number;
  span: number;
  color: BookingColor;
}

interface Bay {
  name: string;
  type: string;
  bookings: Booking[];
}

const COLOR_MAP: Record<BookingColor, { bg: string; title: string; sub: string }> = {
  green:  { bg: '#DCFCE7', title: '#16A34A', sub: '#15803D' },
  blue:   { bg: '#E0F2FE', title: '#0369A1', sub: '#0C4A6E' },
  yellow: { bg: '#FEF3C7', title: '#B45309', sub: '#92400E' },
  red:    { bg: '#FEE2E2', title: '#DC2626', sub: '#991B1B' },
};

const WEEK_DAYS = [
  { label: 'Mon 21', today: false },
  { label: 'Tue 22', today: false },
  { label: 'Wed 23', today: true },
  { label: 'Thu 24', today: false },
  { label: 'Fri 25', today: false },
];

const BAYS: Bay[] = [
  {
    name: 'Bay A-1', type: 'Narrow-body',
    bookings: [
      { airline: 'Ryanair', aircraft: 'B737-800', service: 'C-Check', days: 'Mon–Wed', startDay: 0, span: 3, color: 'green' },
    ],
  },
  {
    name: 'Bay A-2', type: 'Narrow-body',
    bookings: [
      { airline: 'Delta', aircraft: 'A320', service: 'Engine', days: 'Mon–Tue', startDay: 0, span: 2, color: 'blue' },
      { airline: 'Aer Lingus', aircraft: 'A330', service: 'Cabin', days: 'Thu–Fri', startDay: 3, span: 2, color: 'yellow' },
    ],
  },
  { name: 'Bay B-1', type: 'Wide-body', bookings: [] },
  {
    name: 'Bay B-2', type: 'Wide-body',
    bookings: [
      { airline: 'EasyJet', aircraft: 'A320', service: 'Landing Gear', days: 'Wed–Fri', startDay: 2, span: 3, color: 'green' },
    ],
  },
  {
    name: 'Bay C-1', type: 'Heavy',
    bookings: [
      { airline: 'Lufthansa', aircraft: 'B777-300', service: 'Heavy Maintenance', days: 'Full Week', startDay: 0, span: 5, color: 'red' },
    ],
  },
  {
    name: 'Bay C-2', type: 'Heavy',
    bookings: [
      { airline: 'Turkish', aircraft: 'B737', service: 'AOG', days: 'Mon', startDay: 0, span: 1, color: 'yellow' },
      { airline: 'Qatar', aircraft: 'A350', service: 'Inspection', days: 'Thu–Fri', startDay: 3, span: 2, color: 'blue' },
    ],
  },
];

type WeekCell =
  | { type: 'booking'; booking: Booking; flex: number }
  | { type: 'empty'; flex: number };

function computeWeekCells(bay: Bay): WeekCell[] {
  const result: WeekCell[] = [];
  let pos = 0;
  const sorted = [...bay.bookings].sort((a, b) => a.startDay - b.startDay);
  for (const b of sorted) {
    for (let i = pos; i < b.startDay; i++) result.push({ type: 'empty', flex: 1 });
    result.push({ type: 'booking', booking: b, flex: b.span });
    pos = b.startDay + b.span;
  }
  for (let i = pos; i < 5; i++) result.push({ type: 'empty', flex: 1 });
  return result;
}

// ── Month view types & data ─────────────────────────────────────────

interface DayEvent { label: string; color: BookingColor; }

const MONTH_EVENTS: Record<number, DayEvent[]> = {
  1:  [{ label: 'A-1: C-Check',  color: 'green'  }],
  2:  [{ label: 'A-1: C-Check',  color: 'green'  }],
  7:  [{ label: 'B-1: Engine',   color: 'blue'   }],
  8:  [{ label: 'B-1: Engine',   color: 'blue'   }],
  9:  [{ label: 'B-1: Engine',   color: 'blue'   }],
  14: [{ label: 'A-2: Cabin',    color: 'yellow' }],
  15: [{ label: 'A-2: Cabin',    color: 'yellow' }],
  16: [{ label: 'A-2: Cabin',    color: 'yellow' }],
  21: [{ label: 'A-1: Active',   color: 'green'  }, { label: 'A-2: Engine', color: 'blue'   }],
  22: [{ label: 'A-1: Active',   color: 'green'  }, { label: 'B-2: Heavy',  color: 'red'    }],
  23: [{ label: 'A-1: Active',   color: 'green'  }, { label: 'C-1: Cabin',  color: 'yellow' }],
  24: [{ label: 'A-2: Engine',   color: 'blue'   }],
  28: [{ label: 'C-2: Inspect',  color: 'blue'   }],
  29: [{ label: 'C-2: Inspect',  color: 'blue'   }],
  30: [{ label: 'C-2: Inspect',  color: 'blue'   }],
};

interface CalCell {
  dayNum: number;
  label: string;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  events: DayEvent[];
}

const CAL_WEEKS: CalCell[][] = [
  [
    { dayNum: 30, label: '30', isCurrentMonth: false, isWeekend: false, isToday: false, events: [] },
    { dayNum: 31, label: '31', isCurrentMonth: false, isWeekend: false, isToday: false, events: [] },
    { dayNum:  1, label:  '1', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[1]  ?? [] },
    { dayNum:  2, label:  '2', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[2]  ?? [] },
    { dayNum:  3, label:  '3', isCurrentMonth: true,  isWeekend: false, isToday: false, events: [] },
    { dayNum:  4, label:  '4', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
    { dayNum:  5, label:  '5', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
  ],
  [
    { dayNum:  6, label:  '6', isCurrentMonth: true,  isWeekend: false, isToday: false, events: [] },
    { dayNum:  7, label:  '7', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[7]  ?? [] },
    { dayNum:  8, label:  '8', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[8]  ?? [] },
    { dayNum:  9, label:  '9', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[9]  ?? [] },
    { dayNum: 10, label: '10', isCurrentMonth: true,  isWeekend: false, isToday: false, events: [] },
    { dayNum: 11, label: '11', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
    { dayNum: 12, label: '12', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
  ],
  [
    { dayNum: 13, label: '13', isCurrentMonth: true,  isWeekend: false, isToday: false, events: [] },
    { dayNum: 14, label: '14', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[14] ?? [] },
    { dayNum: 15, label: '15', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[15] ?? [] },
    { dayNum: 16, label: '16', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[16] ?? [] },
    { dayNum: 17, label: '17', isCurrentMonth: true,  isWeekend: false, isToday: false, events: [] },
    { dayNum: 18, label: '18', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
    { dayNum: 19, label: '19', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
  ],
  [
    { dayNum: 20, label: '20', isCurrentMonth: true,  isWeekend: false, isToday: false, events: [] },
    { dayNum: 21, label: '21', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[21] ?? [] },
    { dayNum: 22, label: '22', isCurrentMonth: true,  isWeekend: false, isToday: true,  events: MONTH_EVENTS[22] ?? [] },
    { dayNum: 23, label: '23', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[23] ?? [] },
    { dayNum: 24, label: '24', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[24] ?? [] },
    { dayNum: 25, label: '25', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
    { dayNum: 26, label: '26', isCurrentMonth: true,  isWeekend: true,  isToday: false, events: [] },
  ],
  [
    { dayNum: 27, label: '27', isCurrentMonth: true,  isWeekend: false, isToday: false, events: [] },
    { dayNum: 28, label: '28', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[28] ?? [] },
    { dayNum: 29, label: '29', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[29] ?? [] },
    { dayNum: 30, label: '30', isCurrentMonth: true,  isWeekend: false, isToday: false, events: MONTH_EVENTS[30] ?? [] },
    { dayNum:  1, label:  '1', isCurrentMonth: false, isWeekend: false, isToday: false, events: [] },
    { dayNum:  2, label:  '2', isCurrentMonth: false, isWeekend: true,  isToday: false, events: [] },
    { dayNum:  3, label:  '3', isCurrentMonth: false, isWeekend: true,  isToday: false, events: [] },
  ],
];

const MONTH_DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const LEGEND_ITEMS = [
  { color: '#16A34A', label: 'Active Booking',     shape: 'circle' },
  { color: '#0369A1', label: 'Engine Work',         shape: 'circle' },
  { color: '#B45309', label: 'Cabin / Interior',    shape: 'circle' },
  { color: '#DC2626', label: 'Heavy Maintenance',   shape: 'circle' },
  { color: TEAL,      label: 'Today',               shape: 'square'  },
] as const;

// ── Sidebar nav ─────────────────────────────────────────────────────

type NavKey = 'dashboard' | 'manager' | 'chats' | 'bookings' | 'settings';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'manager',   icon: CalendarDays,    label: 'MRO Manager' },
  { key: 'chats',     icon: MessageCircle,   label: 'Chats', badge: 3 },
  { key: 'bookings',  icon: Plane,           label: 'Bookings' },
  { key: 'settings',  icon: Settings,        label: 'Settings' },
];

// ── Mobile bay schedule data ────────────────────────────────────────

type SlotEntry =
  | { kind: 'booking'; title: string; subtitle: string; bg: string; textColor: string }
  | { kind: 'empty' };

interface MobileBayRow { name: string; type: string; slots: SlotEntry[] }

const MOBILE_BAY_ROWS: MobileBayRow[] = [
  {
    name: 'Bay A-1', type: 'Narrow-body',
    slots: [
      { kind: 'booking', title: 'Ryanair · B737-800', subtitle: 'C-Check · Mon – Wed', bg: '#DCFCE7', textColor: '#166534' },
      { kind: 'empty' },
    ],
  },
  {
    name: 'Bay A-2', type: 'Narrow-body',
    slots: [
      { kind: 'booking', title: 'Delta · A320', subtitle: 'Engine · Mon – Tue', bg: '#E0F2FE', textColor: '#0369A1' },
      { kind: 'booking', title: 'Aer Lingus · A330', subtitle: 'Cabin · Thu – Fri', bg: '#FEF3C7', textColor: '#B45309' },
    ],
  },
  {
    name: 'Bay B-1', type: 'Wide-body',
    slots: [{ kind: 'empty' }, { kind: 'empty' }],
  },
  {
    name: 'Bay B-2', type: 'Wide-body',
    slots: [
      { kind: 'empty' },
      { kind: 'booking', title: 'EasyJet · A320', subtitle: 'Landing Gear · Wed – Fri', bg: '#DCFCE7', textColor: '#166534' },
    ],
  },
  {
    name: 'Bay C-1', type: 'Heavy',
    slots: [
      { kind: 'booking', title: 'Lufthansa · B777-300', subtitle: 'Heavy Maintenance · Full Week', bg: '#FEE2E2', textColor: '#991B1B' },
    ],
  },
  {
    name: 'Bay C-2', type: 'Heavy',
    slots: [
      { kind: 'booking', title: 'Turkish · B737', subtitle: 'AOG · Mon', bg: '#FEF3C7', textColor: '#B45309' },
      { kind: 'empty' },
      { kind: 'booking', title: 'Qatar · A350', subtitle: 'Inspection · Thu – Fri', bg: '#E0F2FE', textColor: '#0369A1' },
    ],
  },
];

// ── Component ───────────────────────────────────────────────────────

export default function MRODashboardPage({ onChats, onViewBooking, onManager, onBookings }: {
  onChats?: () => void; onViewBooking?: () => void; onManager?: () => void; onBookings?: () => void;
}) {
  const isMobile = useMobile();
  const [activeNav, setActiveNav] = useState<NavKey>('dashboard');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [addHover, setAddHover] = useState(false);

  if (isMobile) {
    return <MobileLayout onChats={onChats} onViewBooking={onViewBooking} onManager={onManager} onBookings={onBookings} />;
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
              const active = activeNav === key;
              return (
                <button
                  key={key}
                  onClick={() => { setActiveNav(key); if (key === 'chats') onChats?.(); if (key === 'manager') onManager?.(); if (key === 'bookings') onBookings?.(); }}
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
            <span style={{ fontFamily: 'Inter', fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>Dashboard</span>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY }}>Lufthansa Technik Shannon</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} color={TEXT_SECONDARY} style={{ cursor: 'pointer' }} />
            <button
              onMouseEnter={() => setAddHover(true)}
              onMouseLeave={() => setAddHover(false)}
              className="flex items-center gap-1.5"
              style={{ padding: '10px 18px', borderRadius: 8, backgroundColor: addHover ? TEAL_HOVER : TEAL, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF', transition: 'background-color 0.15s' }}
            >
              <Plus size={16} color="#FFFFFF" />
              Add New Slot
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* Stats row */}
          <div className="grid grid-cols-4 shrink-0" style={{ gap: 16, padding: '20px 28px' }}>
            <StatCard label="Active Bookings" value="12" sub="+3 this week" subColor={GREEN} iconBg={BLUE_LIGHT} Icon={CalendarCheck} iconColor={TEAL} />
            <StatCard label="Available Slots" value="24" sub="6 bays open" subColor={TEXT_SECONDARY} iconBg="#FEF3C7" Icon={CalendarPlus} iconColor="#F59E0B" />
            <StatCard label="Revenue (MTD)" value="€185,400" sub="+12% vs last month" subColor={GREEN} iconBg={GREEN_LIGHT} Icon={TrendingUp} iconColor={GREEN} valueFontSize={24} />
            <StatCard label="Bay Utilization" value="78%" iconBg={BG_LIGHT} Icon={Gauge} iconColor={NAVY} progress={78} />
          </div>

          {/* Bay Schedule */}
          <div className="flex-1 flex flex-col min-h-0" style={{ padding: '0 28px 20px', gap: 16 }}>

            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>Bay Schedule</span>
                <div className="flex" style={{ padding: 3, borderRadius: 8, backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}` }}>
                  {(['week', 'month'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      style={{
                        padding: '6px 14px', borderRadius: 6,
                        backgroundColor: viewMode === mode ? '#FFFFFF' : 'transparent',
                        boxShadow: viewMode === mode ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        fontFamily: 'Inter', fontSize: 12,
                        fontWeight: viewMode === mode ? 600 : 500,
                        color: viewMode === mode ? TEXT_PRIMARY : TEXT_MUTED,
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, cursor: 'pointer' }}>
                  <ChevronLeft size={14} color={TEXT_SECONDARY} />
                </button>
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>
                  {viewMode === 'week' ? '21 – 25 April 2026' : 'April 2026'}
                </span>
                <button className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, cursor: 'pointer' }}>
                  <ChevronRight size={14} color={TEXT_SECONDARY} />
                </button>
              </div>
            </div>

            {viewMode === 'week' ? <WeekGrid onViewBooking={onViewBooking} /> : <MonthGrid onViewBooking={onViewBooking} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile layout ───────────────────────────────────────────────────

function MobileLayout({ onChats, onViewBooking, onManager, onBookings }: {
  onChats?: () => void; onViewBooking?: () => void; onManager?: () => void; onBookings?: () => void;
}) {
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

      {/* App header */}
      <div style={{ height: 56, backgroundColor: '#FFFFFF', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Menu size={20} color={TEXT_PRIMARY} />
          <span style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>Dashboard</span>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: TEAL, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} />
          Add Slot
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stats 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <MobileStatCard label="Active Bookings" value="12" sub="+3 this week" subColor="#16A34A" icon={<CalendarCheck size={16} />} iconBg={BLUE_LIGHT} iconColor={TEAL} />
          <MobileStatCard label="Available Slots" value="24" sub="6 bays open" subColor={TEXT_MUTED} icon={<Warehouse size={16} />} iconBg={BG_LIGHT} iconColor={TEXT_SECONDARY} />
          <MobileStatCard label="Revenue" value="€185,400" sub="+12% vs last month" subColor="#16A34A" icon={<TrendingUp size={16} />} iconBg="#F0FDF4" iconColor="#16A34A" />
          <MobileStatCard label="Bay Utilization" value="78%" icon={<Gauge size={16} />} iconBg={BLUE_LIGHT} iconColor={TEAL} progress={78} />
        </div>

        {/* Bay Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>Bay Schedule</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <ChevronLeft size={16} color={TEXT_SECONDARY} />
              </button>
              <span style={{ fontSize: 13, color: TEXT_SECONDARY, fontWeight: 500 }}>This Week</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <ChevronRight size={16} color={TEXT_SECONDARY} />
              </button>
            </div>
          </div>

          {MOBILE_BAY_ROWS.map((bay) => (
            <MobileBayCard key={bay.name} bay={bay} onViewBooking={onViewBooking} />
          ))}
        </div>

        <div style={{ height: 4 }} />
      </div>

      {/* Bottom tab bar */}
      <MobileTabBar onManager={onManager} onChats={onChats} onBookings={onBookings} />
    </div>
  );
}

function MobileStatCard({ label, value, sub, subColor, icon, iconBg, iconColor, progress }: {
  label: string; value: string; sub?: string; subColor?: string;
  icon: React.ReactNode; iconBg: string; iconColor: string; progress?: number;
}) {
  return (
    <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: TEXT_SECONDARY, lineHeight: 1.3 }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>
      <span style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>{value}</span>
      {progress !== undefined ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 4, backgroundColor: BORDER, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: TEAL, borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 10, color: TEXT_MUTED }}>{progress}% utilization</span>
        </div>
      ) : (
        sub && <span style={{ fontSize: 11, color: subColor ?? TEXT_MUTED }}>{sub}</span>
      )}
    </div>
  );
}

function MobileBayCard({ bay, onViewBooking }: { bay: MobileBayRow; onViewBooking?: () => void }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>{bay.name}</span>
        <span style={{ fontSize: 11, color: TEXT_MUTED, backgroundColor: BG_LIGHT, borderRadius: 20, padding: '2px 8px' }}>{bay.type}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {bay.slots.map((slot, i) =>
          slot.kind === 'booking' ? (
            <button
              key={i}
              onClick={onViewBooking}
              style={{ borderRadius: 8, backgroundColor: slot.bg, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2, border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: slot.textColor }}>{slot.title}</span>
              <span style={{ fontSize: 11, color: slot.textColor, opacity: 0.8 }}>{slot.subtitle}</span>
            </button>
          ) : (
            <div key={i} style={{ borderRadius: 8, backgroundColor: BG_LIGHT, border: `1px dashed ${BORDER}`, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
              <Plus size={13} color={TEXT_MUTED} />
              <span style={{ fontSize: 12, color: TEXT_MUTED }}>Add Booking</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function MobileTabBar({ onManager, onChats, onBookings }: { onManager?: () => void; onChats?: () => void; onBookings?: () => void }) {
  const tabs = [
    { key: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard size={18} />, active: true,  handler: undefined as (() => void) | undefined },
    { key: 'slots',     label: 'SLOTS',     icon: <Warehouse size={18} />,       active: false, handler: onManager },
    { key: 'chats',     label: 'CHATS',     icon: <MessageCircle size={18} />,   active: false, handler: onChats,  badge: true },
    { key: 'bookings',  label: 'BOOKINGS',  icon: <BookOpen size={18} />,        active: false, handler: onBookings },
    { key: 'settings',  label: 'SETTINGS',  icon: <Settings size={18} />,        active: false, handler: undefined },
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BORDER}`, padding: '12px 21px 21px', flexShrink: 0 }}>
      <div style={{ backgroundColor: BG_LIGHT, borderRadius: 36, height: 62, padding: 4, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        {tabs.map(({ key, label, icon, active, handler, badge }) => (
          <button
            key={key}
            onClick={handler}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, height: '100%', borderRadius: 26, backgroundColor: active ? TEAL : 'transparent', border: 'none', cursor: handler ? 'pointer' : 'default', position: 'relative', padding: '0 4px' }}
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

// ── Desktop sub-components ──────────────────────────────────────────

function StatCard({
  label, value, sub, subColor, iconBg, Icon, iconColor, progress, valueFontSize = 28,
}: {
  label: string; value: string; sub?: string; subColor?: string;
  iconBg: string; Icon: React.ElementType; iconColor: string;
  progress?: number; valueFontSize?: number;
}) {
  return (
    <div className="flex flex-col gap-2.5" style={{ padding: 20, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>{label}</span>
        <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: iconBg }}>
          <Icon size={18} color={iconColor} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span style={{ fontFamily: 'Inter', fontSize: valueFontSize, fontWeight: 800, color: TEXT_PRIMARY }}>{value}</span>
        {sub && <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: subColor, paddingBottom: 3 }}>{sub}</span>}
      </div>
      {progress !== undefined && (
        <div style={{ height: 6, borderRadius: 999, backgroundColor: BORDER }}>
          <div style={{ height: 6, width: `${progress}%`, borderRadius: 999, backgroundColor: TEAL }} />
        </div>
      )}
    </div>
  );
}

function WeekGrid({ onViewBooking }: { onViewBooking?: () => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
      <div className="flex shrink-0" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
        <div style={{ width: 120, flexShrink: 0 }} />
        {WEEK_DAYS.map((day) => (
          <div key={day.label} className="flex-1 flex items-center justify-center" style={{ padding: '10px 0', backgroundColor: day.today ? BLUE_LIGHT : 'transparent', borderRadius: day.today ? '4px 4px 0 0' : 0 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: day.today ? 700 : 600, color: day.today ? TEAL : TEXT_MUTED }}>{day.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        {BAYS.map((bay, idx) => {
          const cells = computeWeekCells(bay);
          const isLast = idx === BAYS.length - 1;
          return (
            <div key={bay.name} className="flex flex-1 min-h-0" style={{ borderBottom: isLast ? 'none' : `1px solid ${BORDER}` }}>
              <div className="flex flex-col justify-center shrink-0" style={{ width: 120, padding: '0 14px', borderRight: `1px solid ${BORDER}` }}>
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY }}>{bay.name}</span>
                <span style={{ fontFamily: 'Inter', fontSize: 10, color: TEXT_MUTED }}>{bay.type}</span>
              </div>
              <div className="flex flex-1 min-w-0" style={{ gap: 4, padding: 6 }}>
                {cells.map((cell, i) => {
                  if (cell.type === 'booking') {
                    const c = COLOR_MAP[cell.booking.color];
                    return (
                      <div key={i} onClick={onViewBooking} className="flex flex-col justify-center" style={{ flex: cell.flex, minWidth: 0, backgroundColor: c.bg, borderRadius: 8, padding: '6px 10px', gap: 2, cursor: 'pointer' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: c.title, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cell.booking.airline} · {cell.booking.aircraft}
                        </span>
                        <span style={{ fontFamily: 'Inter', fontSize: 10, color: c.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cell.booking.service} · {cell.booking.days}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="flex items-center justify-center" style={{ flex: cell.flex, backgroundColor: BG_LIGHT, borderRadius: 8, border: `1px solid ${BORDER}`, cursor: 'pointer' }}>
                      <Plus size={14} color={TEXT_MUTED} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthGrid({ onViewBooking }: { onViewBooking?: () => void }) {
  return (
    <>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
        <div className="flex shrink-0" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
          {MONTH_DAY_HEADERS.map((h) => (
            <div key={h} className="flex-1 flex items-center justify-center" style={{ padding: '10px 0' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_MUTED }}>{h}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          {CAL_WEEKS.map((week, wi) => {
            const isLastWeek = wi === CAL_WEEKS.length - 1;
            return (
              <div key={wi} className="flex flex-1 min-h-0" style={{ borderBottom: isLastWeek ? 'none' : `1px solid ${BORDER}` }}>
                {week.map((cell, ci) => {
                  const isLastCol = ci === 6;
                  const isDimmed = !cell.isCurrentMonth || cell.isWeekend;
                  const cellBg = cell.isToday ? BLUE_LIGHT : isDimmed ? BG_LIGHT : '#FFFFFF';
                  const numColor = cell.isToday ? TEAL : !cell.isCurrentMonth ? TEXT_MUTED : cell.isWeekend ? TEXT_MUTED : TEXT_PRIMARY;
                  const numWeight = cell.isToday ? 700 : !cell.isCurrentMonth ? 500 : cell.isWeekend ? 500 : 600;
                  return (
                    <div key={ci} className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ padding: 6, gap: 4, backgroundColor: cellBg, borderRight: isLastCol ? 'none' : `1px solid ${BORDER}` }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: numWeight, color: numColor, lineHeight: 1 }}>{cell.label}</span>
                      {cell.events.map((ev, ei) => {
                        const c = COLOR_MAP[ev.color];
                        return (
                          <div key={ei} onClick={onViewBooking} style={{ backgroundColor: c.bg, borderRadius: 4, padding: '3px 6px', overflow: 'hidden', cursor: 'pointer' }}>
                            <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 600, color: c.title, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{ev.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center shrink-0" style={{ gap: 20, paddingTop: 8 }}>
        {LEGEND_ITEMS.map(({ color, label, shape }) => (
          <div key={label} className="flex items-center gap-1.5">
            {shape === 'circle' ? (
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            ) : (
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: BLUE_LIGHT, border: `1px solid ${color}`, flexShrink: 0 }} />
            )}
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, color: TEXT_SECONDARY }}>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
