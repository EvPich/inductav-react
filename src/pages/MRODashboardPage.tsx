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

const DAYS = [
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

type Cell =
  | { type: 'booking'; booking: Booking; flex: number }
  | { type: 'empty'; flex: number };

function computeCells(bay: Bay): Cell[] {
  const result: Cell[] = [];
  let pos = 0;
  const sorted = [...bay.bookings].sort((a, b) => a.startDay - b.startDay);
  for (const b of sorted) {
    for (let i = pos; i < b.startDay; i++) {
      result.push({ type: 'empty', flex: 1 });
    }
    result.push({ type: 'booking', booking: b, flex: b.span });
    pos = b.startDay + b.span;
  }
  for (let i = pos; i < 5; i++) {
    result.push({ type: 'empty', flex: 1 });
  }
  return result;
}

type NavKey = 'dashboard' | 'manager' | 'chats' | 'bookings' | 'settings';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'manager',   icon: CalendarDays,    label: 'MRO Manager' },
  { key: 'chats',     icon: MessageCircle,   label: 'Chats', badge: 3 },
  { key: 'bookings',  icon: Plane,           label: 'Bookings' },
  { key: 'settings',  icon: Settings,        label: 'Settings' },
];

export default function MRODashboardPage() {
  const [activeNav, setActiveNav] = useState<NavKey>('dashboard');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [addHover, setAddHover] = useState(false);

  return (
    <div className="flex overflow-hidden" style={{ height: '100vh', backgroundColor: BG_LIGHT }}>

      {/* ── Sidebar ── */}
      <div
        className="flex flex-col shrink-0"
        style={{ width: 240, backgroundColor: NAVY, height: '100%' }}
      >
        <div className="flex flex-col flex-1 gap-6">
          {/* Logo */}
          <div style={{ padding: '24px 20px' }}>
            <img src="/logo-light.png" alt="InductAV" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1" style={{ padding: '0 12px' }}>
            {NAV_ITEMS.map(({ key, icon: Icon, label, badge }) => {
              const active = activeNav === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveNav(key)}
                  className="flex items-center justify-between w-full text-left"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} color={active ? '#FFFFFF' : TEXT_MUTED} />
                    <span style={{
                      fontFamily: 'Inter', fontSize: 14,
                      fontWeight: active ? 600 : 500,
                      color: active ? '#FFFFFF' : TEXT_MUTED,
                    }}>
                      {label}
                    </span>
                  </div>
                  {badge && (
                    <div className="flex items-center justify-center" style={{
                      width: 22, height: 22, borderRadius: 11, backgroundColor: '#EF4444',
                    }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>
                        {badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User row */}
        <div
          className="flex items-center gap-2.5"
          style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: TEAL }}
          >
            <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>LT</span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
              Lufthansa Technik
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, color: TEXT_MUTED }}>MRO Admin</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            height: 64, backgroundColor: '#FFFFFF',
            borderBottom: `1px solid ${BORDER}`, padding: '0 28px',
          }}
        >
          <div className="flex flex-col gap-0.5">
            <span style={{ fontFamily: 'Inter', fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>
              Dashboard
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY }}>
              Lufthansa Technik Shannon
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} color={TEXT_SECONDARY} style={{ cursor: 'pointer' }} />
            <button
              onMouseEnter={() => setAddHover(true)}
              onMouseLeave={() => setAddHover(false)}
              className="flex items-center gap-1.5"
              style={{
                padding: '10px 18px', borderRadius: 8,
                backgroundColor: addHover ? TEAL_HOVER : TEAL,
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF',
                transition: 'background-color 0.15s',
              }}
            >
              <Plus size={16} color="#FFFFFF" />
              Add New Slot
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* Stats row */}
          <div
            className="grid grid-cols-4 shrink-0"
            style={{ gap: 16, padding: '20px 28px' }}
          >
            {/* Active Bookings */}
            <div className="flex flex-col gap-2.5" style={{
              padding: 20, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
            }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>
                  Active Bookings
                </span>
                <div className="flex items-center justify-center" style={{
                  width: 32, height: 32, borderRadius: 8, backgroundColor: BLUE_LIGHT,
                }}>
                  <CalendarCheck size={18} color={TEAL} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span style={{ fontFamily: 'Inter', fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY }}>12</span>
                <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: GREEN, paddingBottom: 3 }}>
                  +3 this week
                </span>
              </div>
            </div>

            {/* Available Slots */}
            <div className="flex flex-col gap-2.5" style={{
              padding: 20, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
            }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>
                  Available Slots
                </span>
                <div className="flex items-center justify-center" style={{
                  width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF3C7',
                }}>
                  <CalendarPlus size={18} color="#F59E0B" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span style={{ fontFamily: 'Inter', fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY }}>24</span>
                <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY, paddingBottom: 3 }}>
                  6 bays open
                </span>
              </div>
            </div>

            {/* Revenue MTD */}
            <div className="flex flex-col gap-2.5" style={{
              padding: 20, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
            }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>
                  Revenue (MTD)
                </span>
                <div className="flex items-center justify-center" style={{
                  width: 32, height: 32, borderRadius: 8, backgroundColor: GREEN_LIGHT,
                }}>
                  <TrendingUp size={18} color={GREEN} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span style={{ fontFamily: 'Inter', fontSize: 24, fontWeight: 800, color: TEXT_PRIMARY }}>€185,400</span>
                <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: GREEN, paddingBottom: 3 }}>
                  +12% vs last month
                </span>
              </div>
            </div>

            {/* Bay Utilization */}
            <div className="flex flex-col gap-2.5" style={{
              padding: 20, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
            }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>
                  Bay Utilization
                </span>
                <div className="flex items-center justify-center" style={{
                  width: 32, height: 32, borderRadius: 8, backgroundColor: BG_LIGHT,
                }}>
                  <Gauge size={18} color={NAVY} />
                </div>
              </div>
              <div className="flex items-end">
                <span style={{ fontFamily: 'Inter', fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY }}>78%</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, backgroundColor: BORDER }}>
                <div style={{ height: 6, width: '78%', borderRadius: 999, backgroundColor: TEAL }} />
              </div>
            </div>
          </div>

          {/* Bay Schedule */}
          <div className="flex-1 flex flex-col min-h-0" style={{ padding: '0 28px 20px', gap: 16 }}>

            {/* Section header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                  Bay Schedule
                </span>
                {/* Week / Month tab toggle */}
                <div className="flex" style={{
                  padding: 3, borderRadius: 8,
                  backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}`,
                }}>
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

              {/* Date navigation */}
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center" style={{
                  width: 28, height: 28, borderRadius: 6,
                  backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, cursor: 'pointer',
                }}>
                  <ChevronLeft size={14} color={TEXT_SECONDARY} />
                </button>
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>
                  21 – 25 April 2026
                </span>
                <button className="flex items-center justify-center" style={{
                  width: 28, height: 28, borderRadius: 6,
                  backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, cursor: 'pointer',
                }}>
                  <ChevronRight size={14} color={TEXT_SECONDARY} />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
              style={{ borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}
            >
              {/* Day header row */}
              <div
                className="flex shrink-0"
                style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}
              >
                {/* Empty corner */}
                <div style={{ width: 120, flexShrink: 0 }} />
                {DAYS.map((day) => (
                  <div
                    key={day.label}
                    className="flex-1 flex items-center justify-center"
                    style={{
                      padding: '10px 0',
                      backgroundColor: day.today ? BLUE_LIGHT : 'transparent',
                      borderRadius: day.today ? '4px 4px 0 0' : 0,
                    }}
                  >
                    <span style={{
                      fontFamily: 'Inter', fontSize: 12,
                      fontWeight: day.today ? 700 : 600,
                      color: day.today ? TEAL : TEXT_MUTED,
                    }}>
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bay rows */}
              <div className="flex flex-col flex-1 min-h-0">
                {BAYS.map((bay, idx) => {
                  const cells = computeCells(bay);
                  const isLast = idx === BAYS.length - 1;
                  return (
                    <div
                      key={bay.name}
                      className="flex flex-1 min-h-0"
                      style={{ borderBottom: isLast ? 'none' : `1px solid ${BORDER}` }}
                    >
                      {/* Label */}
                      <div
                        className="flex flex-col justify-center shrink-0"
                        style={{
                          width: 120, padding: '0 14px',
                          borderRight: `1px solid ${BORDER}`,
                        }}
                      >
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY }}>
                          {bay.name}
                        </span>
                        <span style={{ fontFamily: 'Inter', fontSize: 10, color: TEXT_MUTED }}>
                          {bay.type}
                        </span>
                      </div>

                      {/* Cells */}
                      <div className="flex flex-1 min-w-0" style={{ gap: 4, padding: 6 }}>
                        {cells.map((cell, i) => {
                          if (cell.type === 'booking') {
                            const c = COLOR_MAP[cell.booking.color];
                            return (
                              <div
                                key={i}
                                className="flex flex-col justify-center"
                                style={{
                                  flex: cell.flex, minWidth: 0,
                                  backgroundColor: c.bg,
                                  borderRadius: 8, padding: '6px 10px', gap: 2,
                                  cursor: 'pointer',
                                }}
                              >
                                <span style={{
                                  fontFamily: 'Inter', fontSize: 11, fontWeight: 700,
                                  color: c.title, whiteSpace: 'nowrap',
                                  overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                  {cell.booking.airline} · {cell.booking.aircraft}
                                </span>
                                <span style={{
                                  fontFamily: 'Inter', fontSize: 10,
                                  color: c.sub, whiteSpace: 'nowrap',
                                  overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                  {cell.booking.service} · {cell.booking.days}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-center"
                              style={{
                                flex: cell.flex,
                                backgroundColor: BG_LIGHT,
                                borderRadius: 8,
                                border: `1px solid ${BORDER}`,
                                cursor: 'pointer',
                              }}
                            >
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
          </div>
        </div>
      </div>
    </div>
  );
}
