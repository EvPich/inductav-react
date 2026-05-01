import { useState } from 'react';
import {
  Plus, Calendar, Wrench, Plane, ChevronDown,
  LayoutDashboard, MessageCircle, Bookmark, Settings,
  Signal, Wifi, BatteryFull,
} from 'lucide-react';

const NAVY = '#1C2B4A';
const TEAL = '#57A091';
const BORDER = '#E2E8F0';
const BG_LIGHT = '#F5F7FA';
const TEXT_PRIMARY = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';

type BayStatus = 'Available' | 'Booked' | 'Blocked';
type FilterTab = 'All Bays' | BayStatus;
type TabKey = 'home' | 'slots' | 'messages' | 'saved' | 'settings';

const STATUS_STYLES: Record<BayStatus, { bg: string; color: string }> = {
  Available: { bg: '#F0FDF4',  color: '#22C55E' },
  Booked:    { bg: '#EDF7F4',  color: '#57A091' },
  Blocked:   { bg: '#FEF2F2',  color: '#EF4444' },
};

const FILTER_TABS: FilterTab[] = ['All Bays', 'Available', 'Booked', 'Blocked'];

interface BayCard {
  name: string;
  status: BayStatus;
  dates: string;
  type: string;
  price: string;
  operator?: string;
}

const BAY_CARDS: BayCard[] = [
  { name: 'Bay A-1', status: 'Available', dates: 'Apr 25–28', type: 'C-Check',           price: '€12,500/day' },
  { name: 'Bay A-2', status: 'Booked',    dates: 'Apr 21–24', type: 'Engine Overhaul',   price: '€15,000/day', operator: 'Ryanair' },
  { name: 'Bay B-1', status: 'Available', dates: 'Apr 26–30', type: 'Cabin Refurb',       price: '€8,200/day'  },
  { name: 'Bay B-2', status: 'Blocked',   dates: 'Apr 22–25', type: 'Heavy Maintenance',  price: '€18,000/day' },
  { name: 'Bay C-1', status: 'Available', dates: 'May 1–5',   type: 'A-Check',            price: '€9,800/day'  },
];

const BOTTOM_TABS: { key: TabKey; label: string; icon: React.ReactNode; badge?: boolean }[] = [
  { key: 'home',     label: 'HOME',     icon: <LayoutDashboard size={18} /> },
  { key: 'slots',    label: 'SLOTS',    icon: <Calendar size={18} /> },
  { key: 'messages', label: 'MESSAGES', icon: <MessageCircle size={18} />, badge: true },
  { key: 'saved',    label: 'SAVED',    icon: <Bookmark size={18} /> },
  { key: 'settings', label: 'SETTINGS', icon: <Settings size={18} /> },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{ height: 62, backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
      <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Signal size={16} color="#FFFFFF" />
        <Wifi size={16} color="#FFFFFF" />
        <BatteryFull size={16} color="#FFFFFF" />
      </div>
    </div>
  );
}

function BayCardItem({ card, onPress }: { card: BayCard; onPress?: () => void }) {
  const s = STATUS_STYLES[card.status];
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
      {/* Top row: name + status pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>{card.name}</span>
        <div style={{ padding: '4px 10px', borderRadius: 12, backgroundColor: s.bg }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{card.status}</span>
        </div>
      </div>

      {/* Mid row: date + type */}
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

      {/* Bottom row: operator (if booked) + price */}
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

function BottomTabBar({ active, onHome, onMessages, onSaved }: {
  active: TabKey;
  onHome?: () => void;
  onMessages?: () => void;
  onSaved?: () => void;
}) {
  const handlers: Partial<Record<TabKey, () => void>> = {
    home: onHome, messages: onMessages, saved: onSaved,
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BORDER}`, padding: '12px 21px 21px', flexShrink: 0 }}>
      <div style={{ backgroundColor: BG_LIGHT, borderRadius: 36, height: 62, padding: 4, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        {BOTTOM_TABS.map(({ key, label, icon, badge }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={handlers[key]}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, height: '100%', borderRadius: 26,
                backgroundColor: isActive ? TEAL : 'transparent',
                border: 'none', cursor: 'pointer', position: 'relative', padding: '0 2px',
              }}
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

// ── Main page ───────────────────────────────────────────────────────────────

interface Props {
  onDashboard?: () => void;
  onChats?: () => void;
  onViewBooking?: () => void;
  onBookings?: () => void;
}

export default function MROManagerMobilePage({ onDashboard, onChats, onViewBooking, onBookings }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All Bays');

  const filtered = activeFilter === 'All Bays'
    ? BAY_CARDS
    : BAY_CARDS.filter(c => c.status === activeFilter);

  return (
    <div style={{ width: 390, height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: BG_LIGHT, fontFamily: 'Inter, system-ui, sans-serif', margin: '0 auto', overflow: 'hidden' }}>

      <StatusBar />

      {/* Navy header */}
      <div style={{ backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px', flexShrink: 0 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>MRO Manager</span>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: TEAL, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} />
          Add Bay
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 0, overflowX: 'auto', flexShrink: 0 }}>
        {FILTER_TABS.map(tab => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
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

        {/* Spacer + Filter chip */}
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
            <BayCardItem
              key={card.name}
              card={card}
              onPress={card.status === 'Booked' ? onViewBooking : undefined}
            />
          ))
        )}
        <div style={{ height: 4 }} />
      </div>

      <BottomTabBar
        active="slots"
        onHome={onDashboard}
        onMessages={onChats}
        onSaved={onBookings}
      />
    </div>
  );
}
