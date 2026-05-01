import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, Building2, CalendarDays, MessageCircle, Plane, Settings,
  ArrowLeft, Check, Timer, Calendar, Clock3, CircleCheck, ChevronDown,
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

const BOOKING_STATUS_OPTIONS = [
  { value: 'Confirmed',   bg: '#E0F2FE', color: '#0369A1' },
  { value: 'In Progress', bg: '#E0F2FE', color: '#0369A1' },
  { value: 'Completed',   bg: '#F1F5F9', color: '#64748B' },
  { value: 'Cancelled',   bg: '#FEE2E2', color: '#DC2626' },
  { value: 'Upcoming',    bg: '#FEF3C7', color: '#D97706' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'Paid',    bg: '#F0FDF4', color: '#16A34A' },
  { value: 'Pending', bg: '#FEF3C7', color: '#D97706' },
  { value: 'Overdue', bg: '#FEE2E2', color: '#DC2626' },
  { value: 'Partial', bg: '#E0F2FE', color: '#0369A1' },
];

type NavKey = 'dashboard' | 'facilities' | 'manager' | 'chats' | 'bookings' | 'settings';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'facilities', icon: Building2,        label: 'Facilities' },
  { key: 'manager',    icon: CalendarDays,     label: 'MRO Manager' },
  { key: 'chats',      icon: MessageCircle,    label: 'Chats', badge: 3 },
  { key: 'bookings',   icon: Plane,            label: 'Bookings' },
  { key: 'settings',   icon: Settings,         label: 'Settings' },
];

const OVERVIEW_ROWS = [
  { label: 'Booking ID', value: 'BK-2401',                 color: TEXT_PRIMARY },
  { label: 'Status',     value: 'In Progress',              color: '#0369A1'   },
  { label: 'Operator',   value: 'Lufthansa',                color: TEXT_PRIMARY },
  { label: 'Aircraft',   value: 'Boeing 737-800 (D-ABCD)', color: TEXT_PRIMARY },
  { label: 'Bay',        value: 'A-1 · Wide-body',          color: TEXT_PRIMARY },
];

const MAINT_TAGS = [
  { label: 'Structural', bg: BLUE_LIGHT,  color: TEAL      },
  { label: 'Engine',     bg: '#F0FDF4',   color: '#16A34A' },
  { label: 'Avionics',   bg: '#E0F2FE',   color: '#0369A1' },
];

const TIMELINE_EVENTS = [
  {
    event: 'Work Started',       date: 'Apr 25, 2026',
    desc:  'Maintenance commenced in Bay A-1',
    badge: 'Active', badgeBg: '#E0F2FE', badgeColor: '#0369A1',
  },
  {
    event: 'Payment Confirmed',  date: 'Apr 18, 2026',
    desc:  'Full payment of €59,500 received',
    badge: 'Done',   badgeBg: '#F0FDF4', badgeColor: '#22C55E',
  },
  {
    event: 'Booking Created',    date: 'Apr 15, 2026',
    desc:  'Booking submitted and confirmed',
    badge: 'Done',   badgeBg: '#F0FDF4', badgeColor: '#22C55E',
  },
];

const REQUIREMENTS = [
  'Hangar space available',
  'Ground power unit',
  'Aircraft jacks',
  'Engine test stand',
  'Paint booth access',
];

// ── Component ─────────────────────────────────────────────────────────

export default function BookingDetailPage({ onBack, onChats, onBookings, onFacilities, onManager }: { onBack?: () => void; onChats?: () => void; onBookings?: () => void; onFacilities?: () => void; onManager?: () => void }) {
  const [bookingStatus, setBookingStatus] = useState('In Progress');
  const [paymentStatus, setPaymentStatus] = useState('Paid');

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
                  onClick={() => {
                    if (key === 'chats')      onChats?.();
                    if (key === 'dashboard')  onBack?.();
                    if (key === 'bookings')   onBookings?.();
                    if (key === 'facilities') onFacilities?.();
                    if (key === 'manager')    onManager?.();
                  }}
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
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5"
              style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, cursor: 'pointer', backgroundColor: 'transparent' }}
            >
              <ArrowLeft size={16} color={TEXT_SECONDARY} />
              <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Back</span>
            </button>
            <div className="flex flex-col gap-0.5">
              <span style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>Booking BK-2401</span>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: TEXT_SECONDARY }}>Lufthansa · C-Check · Bay A-1</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: 'transparent', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 20px', borderRadius: 8, backgroundColor: TEAL, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Check size={16} color="#FFFFFF" />
              Edit Booking
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '24px 28px' }}>
          <div className="flex gap-6">

            {/* ── Left column ── */}
            <div className="flex flex-col flex-1 min-w-0" style={{ gap: 24 }}>

              {/* Booking Overview */}
              <Card title="Booking Overview">
                <div className="flex flex-col">
                  {OVERVIEW_ROWS.map((row, i) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between"
                      style={{
                        padding: '14px 0',
                        borderTop: i === 0 ? 'none' : `1px solid ${BORDER}`,
                      }}
                    >
                      <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_MUTED }}>{row.label}</span>
                      {row.label === 'Status' ? (
                        <StatusDropdown
                          value={bookingStatus}
                          options={BOOKING_STATUS_OPTIONS}
                          onChange={setBookingStatus}
                        />
                      ) : (
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Maintenance Details */}
              <Card title="Maintenance Details">
                {/* Display field */}
                <div className="flex items-center" style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: BG_LIGHT }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>C-Check</span>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {MAINT_TAGS.map((tag) => (
                    <div
                      key={tag.label}
                      style={{ padding: '6px 14px', borderRadius: 20, backgroundColor: tag.bg }}
                    >
                      <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: tag.color }}>{tag.label}</span>
                    </div>
                  ))}
                </div>
                {/* Work Scope */}
                <div className="flex flex-col gap-2">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_SECONDARY }}>Work Scope</span>
                  <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}` }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_SECONDARY, margin: 0, lineHeight: 1.6 }}>
                      Complete C-Check inspection including structural assessment, corrosion treatment, systems testing, landing gear overhaul, and avionics upgrade per manufacturer specifications.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Schedule */}
              <Card title="Schedule">
                {/* Date row */}
                <div className="flex gap-3">
                  <div className="flex flex-col flex-1 gap-1.5">
                    <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Start Date</span>
                    <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderRadius: 8, backgroundColor: BG_LIGHT }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>Apr 25, 2026</span>
                      <Calendar size={16} color={TEAL} />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-1.5">
                    <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>End Date</span>
                    <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderRadius: 8, backgroundColor: BG_LIGHT }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>Apr 28, 2026</span>
                      <Calendar size={16} color={TEAL} />
                    </div>
                  </div>
                </div>
                {/* Duration */}
                <div className="flex items-center gap-2" style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: BG_LIGHT }}>
                  <Timer size={16} color={TEAL} />
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Duration: 4 days</span>
                </div>
                {/* Progress */}
                <div className="flex items-center gap-4 justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Progress</span>
                  <div className="flex-1" style={{ height: 10, borderRadius: 6, backgroundColor: BG_LIGHT, overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', borderRadius: 6, backgroundColor: TEAL }} />
                  </div>
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEAL }}>65%</span>
                </div>
              </Card>

              {/* Status History */}
              <Card>
                {/* Header */}
                <div className="flex items-center gap-2">
                  <Clock3 size={18} color={NAVY} />
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY }}>Status History</span>
                </div>

                {/* Success banner */}
                <div className="flex items-start gap-2.5" style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: '#F0FDF4' }}>
                  <CircleCheck size={16} color="#22C55E" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#166534' }}>
                    Work is in progress — 65% complete. On schedule for Apr 28 delivery.
                  </span>
                </div>

                {/* Timeline events */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between" style={{ paddingBottom: 12 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Timeline</span>
                  </div>
                  <div style={{ height: 1, backgroundColor: BORDER }} />
                  {TIMELINE_EVENTS.map((ev, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between" style={{ padding: '12px 0' }}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: TEXT_PRIMARY }}>{ev.event}</span>
                            <span style={{ fontFamily: 'Inter', fontSize: 11, color: TEXT_MUTED }}>{ev.date}</span>
                          </div>
                          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY }}>{ev.desc}</span>
                        </div>
                        <div style={{ padding: '4px 10px', borderRadius: 20, backgroundColor: ev.badgeBg, flexShrink: 0 }}>
                          <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: ev.badgeColor }}>{ev.badge}</span>
                        </div>
                      </div>
                      {i < TIMELINE_EVENTS.length - 1 && <div style={{ height: 1, backgroundColor: BORDER }} />}
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* ── Right column ── */}
            <div className="flex flex-col shrink-0" style={{ width: 360, gap: 24 }}>

              {/* Pricing & Payment */}
              <Card title="Pricing & Payment">
                {/* Price per day */}
                <div className="flex flex-col gap-1.5">
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Price per Day</span>
                  <div className="flex" style={{ borderRadius: 10, backgroundColor: BG_LIGHT, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', borderRight: `1px solid ${BORDER}` }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>€</span>
                    </div>
                    <div className="flex-1" style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>12,500</span>
                    </div>
                  </div>
                </div>
                {/* Total */}
                <div className="flex flex-col gap-1.5">
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Total (4 days)</span>
                  <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: BG_LIGHT }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>€50,000</span>
                  </div>
                </div>
                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Payment Status</span>
                  <StatusDropdown
                    value={paymentStatus}
                    options={PAYMENT_STATUS_OPTIONS}
                    onChange={setPaymentStatus}
                  />
                </div>
              </Card>

              {/* Requirements & Equipment */}
              <Card title="Requirements & Equipment">
                <div className="flex flex-col gap-2.5">
                  {REQUIREMENTS.map((req) => (
                    <div key={req} className="flex items-center gap-2.5">
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: TEAL }}
                      >
                        <Check size={14} color="#FFFFFF" />
                      </div>
                      <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>
                        {req}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Booking Summary */}
              <Card>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Booking Summary</span>
                  {(() => {
                    const opt = BOOKING_STATUS_OPTIONS.find(o => o.value === bookingStatus) ?? BOOKING_STATUS_OPTIONS[0];
                    return (
                      <div style={{ padding: '4px 12px', borderRadius: 999, backgroundColor: opt.bg }}>
                        <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: opt.color }}>{bookingStatus}</span>
                      </div>
                    );
                  })()}
                </div>
                <div style={{ padding: 16, borderRadius: 10, backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}` }}>
                  {[
                    { label: 'Bay',       value: 'A-1 · Wide-body'   },
                    { label: 'Type',      value: 'C-Check'           },
                    { label: 'Schedule',  value: 'Apr 25 – 28, 2026' },
                    { label: 'Duration',  value: '4 days'            },
                    { label: 'Price/Day', value: '€12,500'           },
                    { label: 'Total',     value: '€50,000', highlight: true },
                  ].map((row, i, arr) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between" style={{ padding: i === 0 ? '0 0 14px' : '14px 0' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: TEXT_MUTED }}>{row.label}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: row.highlight ? 700 : 600, color: row.highlight ? TEAL : TEXT_PRIMARY }}>
                          {row.value}
                        </span>
                      </div>
                      {i < arr.length - 1 && <div style={{ height: 1, backgroundColor: BORDER }} />}
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 16, padding: 24, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}` }}>
      {title && <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>{title}</span>}
      {children}
    </div>
  );
}

// ── StatusDropdown ────────────────────────────────────────────────────

function StatusDropdown({
  value, options, onChange,
}: {
  value: string;
  options: { value: string; bg: string; color: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find(o => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px 4px 12px', borderRadius: 20,
          backgroundColor: current.bg, border: 'none', cursor: 'pointer',
        }}
      >
        <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: current.color }}>{value}</span>
        <ChevronDown
          size={13}
          color={current.color}
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 200,
          backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)', overflow: 'hidden', minWidth: 168,
        }}>
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 14px',
                  borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
                  border: 'none', backgroundColor: isSelected ? opt.bg : 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = BG_LIGHT; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = isSelected ? opt.bg : 'transparent'; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: opt.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: isSelected ? 600 : 500, color: isSelected ? opt.color : TEXT_PRIMARY, flex: 1 }}>
                  {opt.value}
                </span>
                {isSelected && <Check size={13} color={opt.color} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
