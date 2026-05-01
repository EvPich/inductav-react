import { useState } from 'react';
import {
  LayoutDashboard, CalendarDays, MessageCircle, Plane, Settings,
  Bell, Plus, CalendarCheck, CalendarPlus, TrendingUp, Gauge,
  ChevronLeft, ChevronRight,
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

// April 2026 (Apr 1 = Wednesday, Mon-start weeks)
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
  isWeekend: boolean; // Sat or Sun
  isToday: boolean;
  events: DayEvent[];
}

// April 2026: Apr 1 is Wednesday (Mon=0 → Wed=2), so 2 days from prev month
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

// ── Component ───────────────────────────────────────────────────────

export default function MRODashboardPage({ onChats, onViewBooking }: { onChats?: () => void; onViewBooking?: () => void }) {
  const [activeNav, setActiveNav] = useState<NavKey>('dashboard');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [addHover, setAddHover] = useState(false);

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
                  onClick={() => { setActiveNav(key); if (key === 'chats') onChats?.(); }}
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

            {/* Section header */}
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

            {/* Grid — week or month */}
            {viewMode === 'week' ? <WeekGrid onViewBooking={onViewBooking} /> : <MonthGrid onViewBooking={onViewBooking} />}

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat card ───────────────────────────────────────────────────────

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

// ── Week grid ───────────────────────────────────────────────────────

function WeekGrid({ onViewBooking }: { onViewBooking?: () => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
      {/* Day header row */}
      <div className="flex shrink-0" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
        <div style={{ width: 120, flexShrink: 0 }} />
        {WEEK_DAYS.map((day) => (
          <div key={day.label} className="flex-1 flex items-center justify-center" style={{ padding: '10px 0', backgroundColor: day.today ? BLUE_LIGHT : 'transparent', borderRadius: day.today ? '4px 4px 0 0' : 0 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: day.today ? 700 : 600, color: day.today ? TEAL : TEXT_MUTED }}>{day.label}</span>
          </div>
        ))}
      </div>
      {/* Bay rows */}
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

// ── Month grid ──────────────────────────────────────────────────────

function MonthGrid({ onViewBooking }: { onViewBooking?: () => void }) {
  return (
    <>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}>
        {/* Day-of-week headers */}
        <div className="flex shrink-0" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
          {MONTH_DAY_HEADERS.map((h) => (
            <div key={h} className="flex-1 flex items-center justify-center" style={{ padding: '10px 0' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_MUTED }}>{h}</span>
            </div>
          ))}
        </div>

        {/* Week rows */}
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
                    <div
                      key={ci}
                      className="flex-1 flex flex-col min-w-0 overflow-hidden"
                      style={{
                        padding: 6, gap: 4,
                        backgroundColor: cellBg,
                        borderRight: isLastCol ? 'none' : `1px solid ${BORDER}`,
                      }}
                    >
                      <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: numWeight, color: numColor, lineHeight: 1 }}>
                        {cell.label}
                      </span>
                      {cell.events.map((ev, ei) => {
                        const c = COLOR_MAP[ev.color];
                        return (
                          <div
                            key={ei}
                            onClick={onViewBooking}
                            style={{
                              backgroundColor: c.bg,
                              borderRadius: 4,
                              padding: '3px 6px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                            }}
                          >
                            <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 600, color: c.title, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                              {ev.label}
                            </span>
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

      {/* Legend */}
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
