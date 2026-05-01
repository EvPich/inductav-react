import { useState } from 'react';
import {
  LayoutDashboard, CalendarDays, MessageCircle, Plane, Settings,
  ArrowLeft, Check, Timer, Calendar, ChevronDown, TriangleAlert,
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

type NavKey = 'dashboard' | 'manager' | 'chats' | 'bookings' | 'settings';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'manager',   icon: CalendarDays,    label: 'MRO Manager' },
  { key: 'chats',     icon: MessageCircle,   label: 'Chats', badge: 3 },
  { key: 'bookings',  icon: Plane,           label: 'Bookings' },
  { key: 'settings',  icon: Settings,        label: 'Settings' },
];

const BAYS_DATA = [
  { id: 'a1', name: 'Bay A-1', cap: 'Wide-body',   status: 'conflict'   as const },
  { id: 'a2', name: 'Bay A-2', cap: 'Wide-body',   status: 'available'  as const },
  { id: 'b1', name: 'Bay B-1', cap: 'Narrow-body', status: 'available'  as const },
  { id: 'b2', name: 'Bay B-2', cap: 'Narrow-body', status: 'available'  as const },
  { id: 'c1', name: 'Bay C-1', cap: 'Regional',    status: 'booked'     as const },
  { id: 'c2', name: 'Bay C-2', cap: 'Regional',    status: 'available'  as const },
];

const MAINT_TAGS = ['C-Check', 'A-Check', 'Engine Overhaul', 'Heavy Maint.'];

const REQUIREMENTS_INIT = [
  { label: 'Hangar space available', checked: true  },
  { label: 'Ground power unit',      checked: true  },
  { label: 'Aircraft jacks',         checked: false },
  { label: 'Engine test stand',      checked: false },
  { label: 'Paint booth access',     checked: true  },
];

// ── Timeline section data ─────────────────────────────────────────────

const TIMELINE_DAYS = ['21','22','23','24','25','26','27','28','29','30'];

const EXISTING_BOOKINGS = [
  { bay: 'Bay A-1', dates: 'Apr 22–24, 2026', airline: 'Lufthansa',  service: 'Engine Overhaul',          status: 'Booked',    statusBg: '#FEF3C7', statusColor: '#B45309' },
  { bay: 'Bay A-1', dates: 'Mar 15–18, 2026', airline: 'Air France', service: 'Landing Gear Inspection',  status: 'Completed', statusBg: '#F0FDF4', statusColor: '#22C55E' },
];

// ── Component ─────────────────────────────────────────────────────────

export default function BookingDetailPage({ onBack, onChats }: { onBack?: () => void; onChats?: () => void }) {
  const [selectedBay, setSelectedBay] = useState('a1');
  const [selectedTag, setSelectedTag] = useState('C-Check');
  const [recurring, setRecurring] = useState(false);
  const [negotiable, setNegotiable] = useState(true);
  const [reqChecked, setReqChecked] = useState(REQUIREMENTS_INIT.map(r => r.checked));

  const toggleReq = (i: number) =>
    setReqChecked(prev => prev.map((v, idx) => idx === i ? !v : v));

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
                  onClick={() => { if (key === 'chats') onChats?.(); if (key === 'dashboard') onBack?.(); }}
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
              style={{ padding: '10px 20px', borderRadius: 8, backgroundColor: TEAL, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}
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

              {/* Bay Selection */}
              <Card title="Select Bay">
                <div className="grid grid-cols-6 gap-2.5">
                  {BAYS_DATA.map((bay) => {
                    const isSel = selectedBay === bay.id;
                    const isBooked = bay.status === 'booked';
                    return (
                      <button
                        key={bay.id}
                        onClick={() => setSelectedBay(bay.id)}
                        className="flex flex-col items-center justify-center"
                        style={{
                          padding: '14px 0', borderRadius: 10, gap: 4,
                          backgroundColor: isSel ? TEAL : '#FFFFFF',
                          border: isSel ? 'none' : `1px solid ${BORDER}`,
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: isSel ? 700 : 600, color: isSel ? '#FFFFFF' : TEXT_PRIMARY }}>
                          {bay.name}
                        </span>
                        <span style={{ fontFamily: 'Inter', fontSize: 10, color: isSel ? 'rgba(255,255,255,0.7)' : TEXT_MUTED }}>
                          {bay.cap}
                        </span>
                        {bay.status === 'conflict' && (
                          <div className="flex items-center gap-1">
                            <TriangleAlert size={9} color="#FBBF24" />
                            <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 600, color: '#FBBF24' }}>Conflict</span>
                          </div>
                        )}
                        {bay.status === 'available' && (
                          <div className="flex items-center gap-1">
                            <div style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#22C55E' }} />
                            <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 500, color: '#22C55E' }}>Available</span>
                          </div>
                        )}
                        {isBooked && (
                          <div className="flex items-center gap-1">
                            <div style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#EF4444' }} />
                            <span style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 500, color: '#EF4444' }}>Booked</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Maintenance Type */}
              <Card title="Maintenance Type">
                {/* Dropdown */}
                <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderRadius: 10, border: `1px solid ${BORDER}`, cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>C-Check</span>
                  <ChevronDown size={16} color={TEXT_MUTED} />
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {MAINT_TAGS.map((tag) => {
                    const sel = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        style={{
                          padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                          backgroundColor: sel ? BLUE_LIGHT : '#FFFFFF',
                          border: sel ? 'none' : `1px solid ${BORDER}`,
                          fontFamily: 'Inter', fontSize: 12, fontWeight: sel ? 600 : 500,
                          color: sel ? TEAL : TEXT_SECONDARY,
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {/* Description */}
                <div className="flex flex-col gap-2">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_SECONDARY }}>Description</span>
                  <textarea
                    placeholder="Describe the maintenance work scope, expected duration, and any special considerations..."
                    style={{
                      height: 80, padding: '12px 16px', borderRadius: 10, border: `1px solid ${BORDER}`,
                      fontFamily: 'Inter', fontSize: 13, color: TEXT_PRIMARY, resize: 'none',
                      backgroundColor: '#FFFFFF', outline: 'none',
                    }}
                    defaultValue="Full C-Check inspection including structural checks, avionics testing, and interior inspection per Boeing maintenance manual."
                  />
                </div>
              </Card>

              {/* Schedule */}
              <Card title="Schedule">
                {/* Date row */}
                <div className="flex gap-3">
                  <div className="flex flex-col flex-1 gap-1.5">
                    <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Start Date</span>
                    <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderRadius: 10, border: `1px solid ${BORDER}` }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>Apr 25, 2026</span>
                      <Calendar size={16} color={TEXT_MUTED} />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-1.5">
                    <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>End Date</span>
                    <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderRadius: 10, border: `1px solid ${BORDER}` }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>Apr 28, 2026</span>
                      <Calendar size={16} color={TEXT_MUTED} />
                    </div>
                  </div>
                </div>
                {/* Duration */}
                <div className="flex items-center" style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: BG_LIGHT }}>
                  <div className="flex items-center gap-2">
                    <Timer size={16} color={TEAL} />
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Duration: 4 days</span>
                  </div>
                </div>
                {/* Recurring */}
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Recurring Slot</span>
                  <button
                    onClick={() => setRecurring(v => !v)}
                    style={{
                      width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer', border: 'none', flexShrink: 0,
                      backgroundColor: recurring ? TEAL : BORDER, transition: 'background-color 0.2s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 2, left: recurring ? 22 : 2, width: 20, height: 20,
                      borderRadius: 10, backgroundColor: '#FFFFFF', transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              </Card>

              {/* Bay Availability */}
              <Card>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} color={NAVY} />
                    <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY }}>Bay Availability</span>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 20, backgroundColor: BLUE_LIGHT }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEAL }}>Bay A-1</span>
                  </div>
                </div>

                {/* Conflict warning */}
                <div className="flex items-start gap-2.5" style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: '#FEF3C7' }}>
                  <TriangleAlert size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#92400E' }}>
                    Scheduling conflict detected — Apr 25–28 overlaps with an existing booking
                  </span>
                </div>

                {/* Mini timeline */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: TEXT_MUTED }}>April 2026</span>
                  </div>
                  {/* Day labels */}
                  <div className="flex" style={{ gap: 2 }}>
                    {TIMELINE_DAYS.map((d, i) => (
                      <div key={d} className="flex-1 flex items-center justify-center">
                        <span style={{
                          fontFamily: 'Inter', fontSize: 11, fontWeight: (i >= 4 && i <= 7) ? 700 : 'normal', textAlign: 'center',
                          color: (i >= 4 && i <= 7) ? '#EF4444' : TEXT_MUTED,
                        }}>
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Timeline blocks */}
                  <div className="flex" style={{ gap: 2, height: 44 }}>
                    {/* Day 21 — empty */}
                    <div style={{ flex: 1, borderRadius: '4px 0 0 4px', backgroundColor: '#F1F5F9' }} />
                    {/* Days 22–24 — existing booking */}
                    <div className="flex flex-col items-center justify-center" style={{
                      flex: 3, backgroundColor: '#FFF7ED', gap: 2, overflow: 'hidden',
                      border: '1px solid #F59E0B',
                    }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#B45309', textAlign: 'center' }}>Lufthansa</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 9, color: '#D97706', textAlign: 'center' }}>Engine Overhaul</span>
                    </div>
                    {/* Days 25–28 — proposed (conflict) */}
                    <div className="flex flex-col items-center justify-center" style={{
                      flex: 4, backgroundColor: BLUE_LIGHT, gap: 2, overflow: 'hidden',
                      border: '2px solid #EF4444',
                    }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: TEAL, textAlign: 'center' }}>Proposed</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 9, color: TEXT_MUTED, textAlign: 'center' }}>Apr 25–28</span>
                    </div>
                    {/* Days 29–30 — empty */}
                    <div style={{ flex: 2, borderRadius: '0 4px 4px 0', backgroundColor: '#F1F5F9' }} />
                  </div>
                </div>

                {/* Existing bookings list */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between" style={{ paddingBottom: 12 }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>Existing Bookings</span>
                      <div style={{ padding: '3px 8px', borderRadius: 12, backgroundColor: '#E2E8F0' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: TEXT_SECONDARY }}>2</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 1, backgroundColor: BORDER }} />
                  {EXISTING_BOOKINGS.map((bk, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between" style={{ padding: '12px 0' }}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: TEAL }}>{bk.bay}</span>
                            <span style={{ fontFamily: 'Inter', fontSize: 11, color: TEXT_MUTED }}>{bk.dates}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY }}>{bk.airline}</span>
                            <span style={{ fontFamily: 'Inter', fontSize: 12, color: TEXT_SECONDARY }}>{bk.service}</span>
                          </div>
                        </div>
                        <div style={{ padding: '4px 10px', borderRadius: 20, backgroundColor: bk.statusBg }}>
                          <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: bk.statusColor }}>{bk.status}</span>
                        </div>
                      </div>
                      {i < EXISTING_BOOKINGS.length - 1 && <div style={{ height: 1, backgroundColor: BORDER }} />}
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* ── Right column ── */}
            <div className="flex flex-col shrink-0" style={{ width: 360, gap: 24 }}>

              {/* Pricing */}
              <Card title="Pricing">
                {/* Price per day */}
                <div className="flex flex-col gap-1.5">
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>Price per Day</span>
                  <div className="flex" style={{ borderRadius: 10, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', backgroundColor: BG_LIGHT, borderRight: `1px solid ${BORDER}` }}>
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
                {/* Negotiable toggle */}
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Price Negotiable</span>
                  <button
                    onClick={() => setNegotiable(v => !v)}
                    style={{
                      width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer', border: 'none', flexShrink: 0,
                      backgroundColor: negotiable ? TEAL : BORDER, transition: 'background-color 0.2s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 2, left: negotiable ? 22 : 2, width: 20, height: 20,
                      borderRadius: 10, backgroundColor: '#FFFFFF', transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              </Card>

              {/* Requirements & Equipment */}
              <Card title="Requirements & Equipment">
                <div className="flex flex-col gap-2.5">
                  {REQUIREMENTS_INIT.map((req, i) => {
                    const checked = reqChecked[i];
                    return (
                      <label key={req.label} className="flex items-center gap-2.5" style={{ cursor: 'pointer' }}>
                        <button
                          onClick={() => toggleReq(i)}
                          className="flex items-center justify-center shrink-0"
                          style={{
                            width: 20, height: 20, borderRadius: 4, border: 'none', cursor: 'pointer',
                            backgroundColor: checked ? TEAL : '#FFFFFF',
                            outline: checked ? 'none' : `1px solid ${BORDER}`,
                          }}
                        >
                          {checked && <Check size={14} color="#FFFFFF" />}
                        </button>
                        <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: checked ? TEXT_PRIMARY : TEXT_SECONDARY }}>
                          {req.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </Card>

              {/* Slot Preview */}
              <Card>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Slot Preview</span>
                  <div style={{ padding: '4px 12px', borderRadius: 999, backgroundColor: '#F0FDF4' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: '#16A34A' }}>Available</span>
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 10, backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}` }}>
                  {[
                    { label: 'Bay',       value: 'A-1 · Wide-body'    },
                    { label: 'Type',      value: 'C-Check'            },
                    { label: 'Schedule',  value: 'Apr 25 – 28, 2026'  },
                    { label: 'Duration',  value: '4 days'             },
                    { label: 'Price/Day', value: '€12,500'            },
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
