import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Building2, CalendarDays, MessageCircle, Plane, Settings,
  ArrowLeft, Check, Plus, Signal, Wifi, BatteryFull, ChevronLeft,
} from 'lucide-react';

const NAVY = '#1C2B4A';
const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const BG_LIGHT = '#F5F7FA';
const BORDER = '#E2E8F0';
const TEXT_PRIMARY = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';

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

// ── Shared data ─────────────────────────────────────────────────────

type NavKey = 'dashboard' | 'facilities' | 'manager' | 'chats' | 'bookings' | 'settings';

const NAV_ITEMS: { key: NavKey; icon: React.ElementType; label: string; badge?: number }[] = [
  { key: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'facilities', icon: Building2,        label: 'Facilities' },
  { key: 'manager',    icon: CalendarDays,     label: 'MRO Manager' },
  { key: 'chats',      icon: MessageCircle,    label: 'Chats', badge: 3 },
  { key: 'bookings',   icon: Plane,            label: 'Bookings' },
  { key: 'settings',   icon: Settings,         label: 'Settings' },
];

const MRO_ITEMS = [
  { name: 'Engine Overhaul Center',   type: 'Engine MRO',   location: 'Hangar A, North Wing', status: 'Active',       statusBg: '#F0FDF4', statusColor: '#22C55E' },
  { name: 'Airframe Maintenance Bay', type: 'Airframe MRO', location: 'Hangar B, South Wing', status: 'Active',       statusBg: '#F0FDF4', statusColor: '#22C55E' },
  { name: 'Avionics Workshop',         type: 'Avionics MRO', location: 'Building C, East',     status: 'Maintenance',  statusBg: '#FFF7ED', statusColor: '#F59E0B' },
];

// ── Page component ──────────────────────────────────────────────────

interface Props {
  onBack?: () => void;
  onDashboard?: () => void;
  onFacilities?: () => void;
  onManager?: () => void;
  onChats?: () => void;
  onBookings?: () => void;
}

export default function FacilitiesPage({ onBack, onDashboard, onFacilities, onManager, onChats, onBookings }: Props) {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileLayout onBack={onBack} onDashboard={onDashboard} onFacilities={onFacilities} onManager={onManager} onChats={onChats} onBookings={onBookings} />;
  }

  return <DesktopLayout onBack={onBack} onDashboard={onDashboard} onFacilities={onFacilities} onManager={onManager} onChats={onChats} onBookings={onBookings} />;
}

// ── Desktop layout ──────────────────────────────────────────────────

function DesktopLayout({ onBack, onDashboard, onFacilities, onManager, onChats, onBookings }: Props) {
  const navHandlers: Partial<Record<NavKey, () => void>> = {
    dashboard:  onDashboard,
    facilities: onFacilities,
    manager:    onManager,
    chats:      onChats,
    bookings:   onBookings,
  };

  return (
    <div className="flex overflow-hidden" style={{ height: '100vh', backgroundColor: BG_LIGHT, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar */}
      <div className="flex flex-col shrink-0" style={{ width: 240, backgroundColor: NAVY, height: '100%' }}>
        <div className="flex flex-col flex-1 gap-6">
          <div style={{ padding: '24px 20px' }}>
            <img src="/logo-light.png" alt="InductAV" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </div>
          <nav className="flex flex-col gap-1" style={{ padding: '0 12px' }}>
            {NAV_ITEMS.map(({ key, icon: Icon, label, badge }) => {
              const active = key === 'facilities';
              return (
                <button
                  key={key}
                  onClick={navHandlers[key]}
                  className="flex items-center justify-between w-full text-left"
                  style={{ padding: '10px 14px', borderRadius: 8, cursor: navHandlers[key] ? 'pointer' : 'default', backgroundColor: active ? '#243656' : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} color={active ? '#FFFFFF' : TEXT_MUTED} />
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? '#FFFFFF' : TEXT_MUTED }}>{label}</span>
                  </div>
                  {badge && (
                    <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#EF4444' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{badge}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderTop: '1px solid #243656' }}>
          <div className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: TEAL }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>LT</span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Lufthansa Technik</span>
            <span style={{ fontSize: 11, color: TEXT_MUTED }}>MRO Admin</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between shrink-0" style={{ height: 64, backgroundColor: '#FFFFFF', borderBottom: `1px solid ${BORDER}`, padding: '0 28px' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5"
              style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} color={TEXT_SECONDARY} />
              <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Back</span>
            </button>
            <div className="flex flex-col gap-0.5">
              <span style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>Frankfurt Airport Facility</span>
              <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>FRA · Deutsche Lufthansa AG</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${BORDER}`, backgroundColor: 'transparent', fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-2"
              style={{ padding: '10px 20px', borderRadius: 8, backgroundColor: TEAL, border: 'none', fontSize: 13, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Check size={16} color="#FFFFFF" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '24px 28px', display: 'flex', gap: 24 }}>

          {/* Left column */}
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: 24 }}>

            <DesktopCard title="Facility Information">
              <FieldRow>
                <Field label="Company" value="Deutsche Lufthansa AG" muted />
                <Field label="Airport" value="FRA — Frankfurt Airport" muted />
              </FieldRow>
              <FieldRow>
                <Field label="Parking Bays" value="12" />
                <Field label="Country" value="Germany" />
              </FieldRow>
              <FieldRow>
                <Field label="City" value="Frankfurt am Main" />
                <Field label="Address" value="Flughafen, 60547 Frankfurt" />
              </FieldRow>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_SECONDARY }}>Description</span>
                <div style={{ padding: '12px 16px', borderRadius: 10, border: `1px solid ${BORDER}`, minHeight: 80 }}>
                  <p style={{ fontSize: 13, color: TEXT_SECONDARY, margin: 0, lineHeight: 1.6 }}>
                    Primary MRO facility serving Central European airlines. Equipped with state-of-the-art hangars and maintenance infrastructure for wide-body and narrow-body aircraft.
                  </p>
                </div>
              </div>
            </DesktopCard>

            <DesktopCard title="Contacts">
              <FieldRow>
                <Field label="Primary Contact" value="Hans Mueller" />
                <Field label="Sales Email" value="sales@lht-mro.com" />
              </FieldRow>
              <FieldRow>
                <Field label="Sales Phone" value="+49 69 696 0" />
                <Field label="AGO Contact" value="Karl Schmidt" />
              </FieldRow>
            </DesktopCard>

          </div>

          {/* Right column */}
          <div className="flex flex-col shrink-0" style={{ width: 400, gap: 24 }}>

            <DesktopCard title="Workforce & Capacity">
              <FieldRow>
                <Field label="Total Employees" value="450" />
                <Field label="Licensed Engineers" value="180" muted />
              </FieldRow>
              <div className="flex items-center justify-between" style={{ paddingTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Working Hours</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>Mon–Fri 06:00–22:00</span>
              </div>
            </DesktopCard>

            <DesktopCard
              title="Connected MROs"
              badge={
                <div style={{ padding: '4px 12px', borderRadius: 999, backgroundColor: '#F0FDF4' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A' }}>3 Active</span>
                </div>
              }
            >
              {MRO_ITEMS.map((mro) => (
                <div
                  key={mro.name}
                  className="flex items-center justify-between"
                  style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: BG_LIGHT }}
                >
                  <div className="flex flex-col" style={{ gap: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>{mro.name}</span>
                    <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{mro.type}</span>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 6, backgroundColor: mro.statusBg }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: mro.statusColor }}>{mro.status}</span>
                  </div>
                </div>
              ))}
              <button
                className="flex items-center justify-center gap-2"
                style={{ width: '100%', height: 44, borderRadius: 10, border: `1px solid ${TEAL}`, backgroundColor: 'transparent', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EDF7F4')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Plus size={16} color={TEAL} />
                <span style={{ fontSize: 13, fontWeight: 600, color: TEAL }}>Add MRO</span>
              </button>
            </DesktopCard>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Desktop sub-components ──────────────────────────────────────────

function DesktopCard({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>{title}</span>
        {badge}
      </div>
      {children}
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3">{children}</div>;
}

function Field({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex flex-col flex-1 min-w-0" style={{ gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>{label}</span>
      <div
        style={{
          display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 10,
          backgroundColor: muted ? BG_LIGHT : '#FFFFFF',
          border: muted ? 'none' : `1px solid ${BORDER}`,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{value}</span>
      </div>
    </div>
  );
}

// ── Mobile layout ───────────────────────────────────────────────────

function MobileLayout({ onBack, onDashboard: _onDashboard, onFacilities: _onFacilities, onManager: _onManager, onChats: _onChats, onBookings: _onBookings }: Props) {
  return (
    <div style={{ width: '100%', maxWidth: 430, height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: BG_LIGHT, fontFamily: 'Inter, system-ui, sans-serif', margin: '0 auto', overflow: 'hidden' }}>

      {/* Status bar */}
      <div style={{ height: 44, backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 0', flexShrink: 0 }}>
        <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Signal size={16} color="#FFFFFF" />
          <Wifi size={16} color="#FFFFFF" />
          <BatteryFull size={16} color="#FFFFFF" />
        </div>
      </div>

      {/* Header */}
      <div style={{ height: 56, backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </button>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Facilities</span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 500, color: TEAL }}>
          Save
        </button>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Facility Information */}
        <MobileCard title="Facility Information">
          <MobileField label="Company Name" value="Lufthansa Technik" muted />
          <MobileField label="Airport" value="FRA — Frankfurt Airport" muted />
          <MobileField label="Parking Bays" value="12" />
          <MobileField label="Country" value="Germany" />
          <MobileField label="City" value="Frankfurt" />
          <MobileField label="Address" value="Flughafen Frankfurt, 60547" />
          <MobileField label="Facility Description" value="Full-service MRO facility specializing in narrow-body aircraft maintenance, engine overhaul, and avionics repair." tall />
        </MobileCard>

        {/* Contacts */}
        <MobileCard title="Contacts">
          <MobileField label="Primary Contact Name" value="Hans Weber" />
          <MobileField label="Sales Contact Email" value="sales@lufthansa-technik.com" />
          <MobileField label="Sales Contact Phone" value="+49 69 696 0" />
          <MobileField label="AGO Contact" value="Klaus Schmidt" />
        </MobileCard>

        {/* Workforce & Capacity */}
        <MobileCard title="Workforce & Capacity">
          <MobileField label="Total Employees" value="342" />
          <MobileField label="Licensed Engineers" value="89" />
          <MobileField label="Working Hours" value="Mon–Fri 06:00–22:00" />
        </MobileCard>

        {/* Connected MROs */}
        <MobileCard title="Connected MROs">
          {MRO_ITEMS.map((mro) => (
            <div
              key={mro.name}
              className="flex items-center justify-between"
              style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: BG_LIGHT }}
            >
              <div className="flex flex-col" style={{ gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>{mro.name}</span>
                <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{mro.location}</span>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 6, backgroundColor: mro.statusBg }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: mro.statusColor }}>{mro.status}</span>
              </div>
            </div>
          ))}
          <button
            className="flex items-center justify-center gap-2"
            style={{ width: '100%', height: 44, borderRadius: 8, border: `1px solid ${TEAL}`, backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            <Plus size={16} color={TEAL} />
            <span style={{ fontSize: 14, fontWeight: 600, color: TEAL }}>Add MRO</span>
          </button>
        </MobileCard>

        {/* Save button */}
        <button
          style={{ width: '100%', height: 48, borderRadius: 12, backgroundColor: TEAL, border: 'none', fontSize: 16, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = TEAL)}
        >
          Save Changes
        </button>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

function MobileCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>{title}</span>
      {children}
    </div>
  );
}

function MobileField({ label, value, muted = false, tall = false }: { label: string; value: string; muted?: boolean; tall?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>{label}</span>
      <div
        style={{
          display: 'flex', alignItems: tall ? 'flex-start' : 'center',
          padding: tall ? '12px 14px' : '0 14px',
          borderRadius: 8,
          backgroundColor: muted ? BG_LIGHT : '#FFFFFF',
          border: muted ? 'none' : `1px solid ${BORDER}`,
          minHeight: tall ? 100 : 44,
        }}
      >
        <span style={{ fontSize: 15, color: TEXT_PRIMARY, lineHeight: tall ? 1.5 : undefined }}>{value}</span>
      </div>
    </div>
  );
}
