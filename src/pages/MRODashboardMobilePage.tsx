import { useState } from 'react';
import {
  Menu, Plus, ChevronLeft, ChevronRight,
  LayoutDashboard, CalendarDays, MessageSquare,
  BookOpen, Settings, TrendingUp, Warehouse,
} from 'lucide-react';

const NAVY = '#1C2B4A';
const TEAL = '#57A091';
const BORDER = '#E2E8F0';
const BG_LIGHT = '#F5F7FA';
const TEXT_PRIMARY = '#0F172A';
const TEXT_SECONDARY = '#64748B';
const TEXT_MUTED = '#94A3B8';

interface Props {
  onDashboard?: () => void;
  onChats?: () => void;
  onBookings?: () => void;
}

// ── Bay schedule data ────────────────────────────────────────────────────────

type BookingBlock = {
  title: string;
  subtitle: string;
  bg: string;
  textColor: string;
};
type SlotEntry = { kind: 'booking'; data: BookingBlock } | { kind: 'empty' };
interface BayRow {
  name: string;
  type: string;
  slots: SlotEntry[];
}

const BAY_ROWS: BayRow[] = [
  {
    name: 'Bay A-1', type: 'Narrow-body',
    slots: [
      { kind: 'booking', data: { title: 'Ryanair · B737-800', subtitle: 'C-Check  ·  Mon – Wed', bg: '#DCFCE7', textColor: '#166534' } },
      { kind: 'empty' },
    ],
  },
  {
    name: 'Bay A-2', type: 'Narrow-body',
    slots: [
      { kind: 'booking', data: { title: 'Delta · A320', subtitle: 'Engine  ·  Mon – Tue', bg: '#E0F2FE', textColor: '#0369A1' } },
      { kind: 'booking', data: { title: 'Aer Lingus · A330', subtitle: 'Cabin  ·  Thu – Fri', bg: '#FEF3C7', textColor: '#B45309' } },
    ],
  },
  {
    name: 'Bay B-1', type: 'Wide-body',
    slots: [
      { kind: 'empty' },
      { kind: 'empty' },
    ],
  },
  {
    name: 'Bay B-2', type: 'Wide-body',
    slots: [
      { kind: 'empty' },
      { kind: 'booking', data: { title: 'EasyJet · A320', subtitle: 'Landing Gear  ·  Wed – Fri', bg: '#DCFCE7', textColor: '#166534' } },
    ],
  },
  {
    name: 'Bay C-1', type: 'Heavy',
    slots: [
      { kind: 'booking', data: { title: 'Lufthansa · B777-300', subtitle: 'Heavy Maintenance  ·  Full Week', bg: '#FEE2E2', textColor: '#991B1B' } },
    ],
  },
  {
    name: 'Bay C-2', type: 'Heavy',
    slots: [
      { kind: 'booking', data: { title: 'Turkish · B737', subtitle: 'AOG  ·  Mon', bg: '#FEF3C7', textColor: '#B45309' } },
      { kind: 'empty' },
      { kind: 'booking', data: { title: 'Qatar · A350', subtitle: 'Inspection  ·  Thu – Fri', bg: '#E0F2FE', textColor: '#0369A1' } },
    ],
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{ height: 62, backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
      <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="white" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white" />
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="white" />
          <path d="M4.5 7.1a4.9 4.9 0 0 1 7 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1.5 4.2a8.5 8.5 0 0 1 13 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" strokeOpacity="0.5" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="white" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function AppHeader() {
  return (
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
  );
}

function StatCard({ label, value, sub, subColor, icon, iconBg, iconColor, progress }: {
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

function BookingSlot({ slot }: { slot: SlotEntry }) {
  if (slot.kind === 'booking') {
    const { title, subtitle, bg, textColor } = slot.data;
    return (
      <div style={{ borderRadius: 8, backgroundColor: bg, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: textColor }}>{title}</span>
        <span style={{ fontSize: 11, color: textColor, opacity: 0.8 }}>{subtitle}</span>
      </div>
    );
  }
  return (
    <div style={{ borderRadius: 8, backgroundColor: BG_LIGHT, border: `1px dashed ${BORDER}`, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
      <Plus size={13} color={TEXT_MUTED} />
      <span style={{ fontSize: 12, color: TEXT_MUTED }}>Add Booking</span>
    </div>
  );
}

function BayCard({ bay }: { bay: BayRow }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>{bay.name}</span>
        <span style={{ fontSize: 11, color: TEXT_MUTED, backgroundColor: BG_LIGHT, borderRadius: 20, padding: '2px 8px' }}>{bay.type}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {bay.slots.map((slot, i) => <BookingSlot key={i} slot={slot} />)}
      </div>
    </div>
  );
}

type TabKey = 'dashboard' | 'slots' | 'chats' | 'bookings' | 'settings';

const TABS: { key: TabKey; label: string; icon: React.ReactNode; badge?: boolean }[] = [
  { key: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard size={18} /> },
  { key: 'slots', label: 'SLOTS', icon: <Warehouse size={18} /> },
  { key: 'chats', label: 'CHATS', icon: <MessageSquare size={18} />, badge: true },
  { key: 'bookings', label: 'BOOKINGS', icon: <BookOpen size={18} /> },
  { key: 'settings', label: 'SETTINGS', icon: <Settings size={18} /> },
];

function BottomTabBar({ active, onChats, onBookings }: { active: TabKey; onChats?: () => void; onBookings?: () => void }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BORDER}`, padding: '12px 21px 21px', flexShrink: 0 }}>
      <div style={{ backgroundColor: BG_LIGHT, borderRadius: 36, height: 62, padding: 4, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        {TABS.map(({ key, label, icon, badge }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => { if (key === 'chats') onChats?.(); if (key === 'bookings') onBookings?.(); }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, height: '100%', borderRadius: 26, backgroundColor: isActive ? TEAL : 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '0 4px' }}
            >
              <span style={{ color: isActive ? '#FFFFFF' : TEXT_MUTED, position: 'relative', display: 'flex' }}>
                {icon}
                {badge && !isActive && (
                  <span style={{ position: 'absolute', top: -2, right: -3, width: 7, height: 7, borderRadius: '50%', backgroundColor: '#EF4444', border: '1.5px solid white' }} />
                )}
              </span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5, color: isActive ? '#FFFFFF' : TEXT_MUTED }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function MRODashboardMobilePage({ onDashboard: _onDashboard, onChats, onBookings }: Props) {
  const [_activeTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ width: 390, height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: BG_LIGHT, fontFamily: 'Inter, system-ui, sans-serif', margin: '0 auto', overflow: 'hidden' }}>
      <StatusBar />
      <AppHeader />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stats 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard
            label="Active Bookings"
            value="12"
            sub="+3 this week"
            subColor="#16A34A"
            icon={<CalendarDays size={16} />}
            iconBg="#EDF7F4"
            iconColor={TEAL}
          />
          <StatCard
            label="Available Slots"
            value="24"
            sub="6 bays open"
            subColor={TEXT_MUTED}
            icon={<Warehouse size={16} />}
            iconBg={BG_LIGHT}
            iconColor={TEXT_SECONDARY}
          />
          <StatCard
            label="Revenue"
            value="€185,400"
            sub="+12% vs last month"
            subColor="#16A34A"
            icon={<TrendingUp size={16} />}
            iconBg="#F0FDF4"
            iconColor="#16A34A"
          />
          <StatCard
            label="Bay Utilization"
            value="78%"
            icon={<Warehouse size={16} />}
            iconBg="#EDF7F4"
            iconColor={TEAL}
            progress={78}
          />
        </div>

        {/* Bay Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Schedule header */}
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

          {/* Bay cards */}
          {BAY_ROWS.map((bay) => <BayCard key={bay.name + bay.type} bay={bay} />)}
        </div>

        {/* Bottom spacer so last card doesn't sit flush against tab bar */}
        <div style={{ height: 4 }} />
      </div>

      <BottomTabBar active="dashboard" onChats={onChats} onBookings={onBookings} />
    </div>
  );
}
