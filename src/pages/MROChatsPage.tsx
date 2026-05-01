import { useState } from 'react';
import {
  LayoutDashboard, CalendarDays, MessageCircle, Plane, Settings,
  Search, Phone, EllipsisVertical, Paperclip, Send,
  CalendarPlus, FileText, ClipboardList, Wrench, Warehouse,
  Calendar, CreditCard, ExternalLink, Image,
} from 'lucide-react';

const NAVY       = '#1C2B4A';
const TEAL       = '#57A091';
const TEAL_HOVER = '#478A7C';
const BLUE_LIGHT = '#EDF7F4';
const BG_LIGHT   = '#F5F7FA';
const BORDER     = '#E2E8F0';
const TEXT_PRIMARY   = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED     = '#94A3B8';
const GREEN = '#22C55E';

// ── Chat list data ──────────────────────────────────────────────────

interface Chat {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  time: string;
  preview: string;
  badge?: number;
}

const CHATS: Chat[] = [
  {
    id: 'ryanair', initials: 'RY', avatarColor: '#009DE0',
    name: 'Ryanair Fleet Ops', time: '2m ago',
    preview: 'Can we extend the C-Check by one day? Need additional cabin work...',
    badge: 2,
  },
  {
    id: 'delta', initials: 'DL', avatarColor: '#F59E0B',
    name: 'Delta MRO Coord', time: '1h ago',
    preview: 'Engine parts are confirmed for delivery Thursday morning.',
  },
  {
    id: 'easyjet', initials: 'EJ', avatarColor: '#22C55E',
    name: 'EasyJet Bookings', time: '3h ago',
    preview: 'Confirmed for landing gear inspection Wed–Fri.',
  },
  {
    id: 'turkish', initials: 'TK', avatarColor: '#DC2626',
    name: 'Turkish Airlines', time: 'Yesterday',
    preview: 'AOG resolved. Aircraft cleared for departure.',
  },
];

// ── Booking context data ────────────────────────────────────────────

const BOOKING_ROWS = [
  { Icon: Plane,      label: 'Aircraft',  value: 'Boeing 737-800', valueColor: TEXT_PRIMARY },
  { Icon: Wrench,     label: 'Service',   value: 'C-Check',        valueColor: TEXT_PRIMARY },
  { Icon: Warehouse,  label: 'Bay',       value: 'Bay A-1',        valueColor: TEXT_PRIMARY },
  { Icon: Calendar,   label: 'Schedule',  value: 'Apr 21–23, 2026',valueColor: TEXT_PRIMARY },
  { Icon: CreditCard, label: 'Quote',     value: '€42,500',        valueColor: TEAL },
];

const QUICK_ACTIONS = [
  { Icon: CalendarPlus,  label: 'Extend Booking'    },
  { Icon: FileText,      label: 'Send Quote Update' },
  { Icon: ClipboardList, label: 'View Work Order'   },
];

const SHARED_FILES = [
  { Icon: FileText, iconColor: TEAL,      name: 'Maintenance_Log_B737.pdf', meta: '2.4 MB · Apr 20' },
  { Icon: Image,    iconColor: '#F59E0B', name: 'Bay_A1_photo.jpg',         meta: '1.8 MB · Apr 19' },
];

// ── Component ───────────────────────────────────────────────────────

export default function MROChatsPage({
  onDashboard,
}: {
  onDashboard?: () => void;
}) {
  const [selectedChat, setSelectedChat] = useState('ryanair');
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      {/* Typing dots animation */}
      <style>{`
        @keyframes mro-typing { 0%,60%,100%{opacity:.2} 30%{opacity:1} }
        .td1{animation:mro-typing 1.2s infinite}
        .td2{animation:mro-typing 1.2s .25s infinite}
        .td3{animation:mro-typing 1.2s .5s infinite}
      `}</style>

      <div className="flex overflow-hidden" style={{ height: '100vh', backgroundColor: BG_LIGHT }}>

        {/* ── Sidebar ── */}
        <div className="flex flex-col shrink-0" style={{ width: 240, backgroundColor: NAVY, height: '100%' }}>
          <div className="flex flex-col flex-1 gap-6">
            <div style={{ padding: '24px 20px' }}>
              <img src="/logo-light.png" alt="InductAV" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
            </div>
            <nav className="flex flex-col gap-1" style={{ padding: '0 12px' }}>
              {[
                { key: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard', active: false, onClick: onDashboard },
                { key: 'manager',   Icon: CalendarDays,    label: 'MRO Manager', active: false },
                { key: 'chats',     Icon: MessageCircle,   label: 'Chats',       active: true,  badge: 3 },
                { key: 'bookings',  Icon: Plane,           label: 'Bookings',    active: false },
                { key: 'settings',  Icon: Settings,        label: 'Settings',    active: false },
              ].map(({ key, Icon, label, active, badge, onClick }) => (
                <button
                  key={key}
                  onClick={onClick}
                  className="flex items-center justify-between w-full text-left"
                  style={{ padding: '10px 14px', borderRadius: 8, cursor: onClick ? 'pointer' : 'default', backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent' }}
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
              ))}
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

        {/* ── Chat Main ── */}
        <div className="flex flex-1 min-w-0 overflow-hidden">

          {/* Chat List */}
          <div className="flex flex-col shrink-0 overflow-hidden" style={{ width: 300, backgroundColor: '#FFFFFF', borderRight: `1px solid ${BORDER}` }}>
            {/* Header */}
            <div className="flex items-center justify-between shrink-0" style={{ height: 64, padding: '0 16px', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>Messages</span>
              <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: BG_LIGHT, cursor: 'pointer' }}>
                <Search size={16} color={TEXT_SECONDARY} />
              </div>
            </div>
            {/* Items */}
            <div className="flex flex-col overflow-y-auto flex-1">
              {CHATS.map((chat) => {
                const isSelected = selectedChat === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className="flex items-start w-full text-left"
                    style={{ gap: 12, padding: '14px 16px', backgroundColor: isSelected ? BLUE_LIGHT : '#FFFFFF', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', transition: 'background-color 0.1s' }}
                  >
                    {/* Avatar */}
                    <div className="flex items-center justify-center shrink-0" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: chat.avatarColor }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{chat.initials}</span>
                    </div>
                    {/* Info */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: isSelected ? 700 : 600, color: TEXT_PRIMARY }}>{chat.name}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: 11, color: TEXT_MUTED, flexShrink: 0 }}>{chat.time}</span>
                      </div>
                      <span style={{ fontFamily: 'Inter', fontSize: 12, color: TEXT_SECONDARY, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                        {chat.preview}
                      </span>
                    </div>
                    {/* Badge */}
                    {chat.badge && (
                      <div className="flex items-center justify-center shrink-0" style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: TEAL, marginTop: 2 }}>
                        <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>{chat.badge}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Conv header */}
            <div className="flex items-center justify-between shrink-0" style={{ height: 64, padding: '0 20px', borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#009DE0' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>RY</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Ryanair Fleet Ops</span>
                  <div className="flex items-center gap-1">
                    <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN }} />
                    <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, color: GREEN }}>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} color={TEXT_SECONDARY} style={{ cursor: 'pointer' }} />
                <EllipsisVertical size={18} color={TEXT_SECONDARY} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Context bar */}
            <div className="flex items-center shrink-0" style={{ gap: 10, padding: '10px 20px', backgroundColor: BG_LIGHT, borderBottom: `1px solid ${BORDER}` }}>
              <Plane size={14} color={TEAL} />
              <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: TEAL }}>
                Booking: B737-800 · C-Check · Bay A-1 · Apr 21–23
              </span>
              <div style={{ borderRadius: 999, backgroundColor: '#DCFCE7', padding: '3px 8px' }}>
                <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#16A34A' }}>Active</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto" style={{ padding: 20, gap: 16, justifyContent: 'flex-end' }}>
              {/* System pill */}
              <div className="flex justify-center">
                <div style={{ borderRadius: 999, backgroundColor: BG_LIGHT, padding: '6px 14px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, color: TEXT_MUTED }}>Booking created · Apr 18, 2026</span>
                </div>
              </div>

              {/* Received 1 */}
              <div className="flex items-end gap-2">
                <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#009DE0' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>RY</span>
                </div>
                <div className="flex flex-col gap-1" style={{ maxWidth: 360, borderRadius: '12px 12px 12px 4px', backgroundColor: BG_LIGHT, padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.5 }}>
                    Hi, we've confirmed the B737-800 C-Check booking for Bay A-1, April 21–23. Our team will have the aircraft ready for induction Monday morning.
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, color: TEXT_MUTED }}>10:24 AM</span>
                </div>
              </div>

              {/* Sent 1 */}
              <div className="flex justify-end">
                <div className="flex flex-col gap-1" style={{ maxWidth: 340, borderRadius: '12px 12px 4px 12px', backgroundColor: TEAL, padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#FFFFFF', lineHeight: 1.5 }}>
                    Great, Bay A-1 is prepped and ready. We'll have the crew standing by from 07:00. Please share the maintenance log when available.
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>10:31 AM</span>
                </div>
              </div>

              {/* Received 2 */}
              <div className="flex items-end gap-2">
                <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#009DE0' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>RY</span>
                </div>
                <div className="flex flex-col gap-1" style={{ maxWidth: 380, borderRadius: '12px 12px 12px 4px', backgroundColor: BG_LIGHT, padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.5 }}>
                    Can we extend the C-Check by one day? Need additional cabin work on the overhead bins. Would Bay A-1 be available through Thursday?
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, color: TEXT_MUTED }}>11:45 AM</span>
                </div>
              </div>

              {/* Typing indicator */}
              <div className="flex items-end gap-2">
                <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: TEAL }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>LT</span>
                </div>
                <div className="flex items-center" style={{ gap: 6, borderRadius: '12px 12px 12px 4px', backgroundColor: BG_LIGHT, padding: '10px 14px' }}>
                  <div className="td1" style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: TEXT_MUTED }} />
                  <div className="td2" style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: TEXT_MUTED }} />
                  <div className="td3" style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: TEXT_MUTED }} />
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="flex items-center shrink-0" style={{ gap: 10, padding: '12px 20px', backgroundColor: '#FFFFFF', borderTop: `1px solid ${BORDER}` }}>
              <Paperclip size={20} color={TEXT_MUTED} style={{ cursor: 'pointer', flexShrink: 0 }} />
              <div className="flex items-center flex-1" style={{ height: 40, borderRadius: 20, backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}`, padding: '0 16px' }}>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ fontFamily: 'Inter', color: TEXT_PRIMARY }}
                />
              </div>
              <button
                className="flex items-center justify-center shrink-0 transition-colors"
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TEAL }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
              >
                <Send size={18} color="#FFFFFF" />
              </button>
            </div>
          </div>

          {/* Booking Context */}
          <div className="flex flex-col shrink-0 overflow-y-auto" style={{ width: 280, backgroundColor: '#FFFFFF', borderLeft: `1px solid ${BORDER}`, padding: '20px 16px', gap: 20 }}>

            {/* Title */}
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Booking Details</span>
              <ExternalLink size={16} color={TEXT_MUTED} style={{ cursor: 'pointer' }} />
            </div>

            {/* Info card */}
            <div className="flex flex-col" style={{ borderRadius: 10, backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}`, padding: 14, gap: 12 }}>
              {BOOKING_ROWS.map(({ Icon, label, value, valueColor }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon size={14} color={TEXT_MUTED} />
                  <div className="flex flex-col" style={{ gap: 1 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 500, color: TEXT_MUTED }}>{label}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: valueColor }}>{value}</span>
                  </div>
                </div>
              ))}
              {/* Status row */}
              <div className="flex items-center justify-between" style={{ paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 500, color: TEXT_MUTED }}>Status</span>
                <div style={{ borderRadius: 999, backgroundColor: '#DCFCE7', padding: '4px 10px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#16A34A' }}>Confirmed</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY }}>Quick Actions</span>
              {QUICK_ACTIONS.map(({ Icon, label }) => (
                <button
                  key={label}
                  className="flex items-center w-full transition-colors hover:bg-slate-100"
                  style={{ gap: 8, padding: '10px 12px', borderRadius: 8, backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}`, cursor: 'pointer' }}
                >
                  <Icon size={16} color={TEAL} />
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{label}</span>
                </button>
              ))}
            </div>

            {/* Shared Files */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY }}>Shared Files</span>
              {SHARED_FILES.map(({ Icon, iconColor, name, meta }) => (
                <div key={name} className="flex items-center" style={{ gap: 10, cursor: 'pointer' }}>
                  <div className="flex items-center justify-center shrink-0" style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: BG_LIGHT }}>
                    <Icon size={16} color={iconColor} />
                  </div>
                  <div className="flex flex-col min-w-0" style={{ gap: 1 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 10, color: TEXT_MUTED }}>{meta}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
