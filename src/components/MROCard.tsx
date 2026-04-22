import { MapPin } from 'lucide-react';

export interface MROCardProps {
  name?: string;
  location?: string;
  serviceType?: string;
  available?: boolean;
  imageUrl?: string;
  onViewProfile?: () => void;
}

const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const GREEN = '#22C55E';

export default function MROCard({
  name = 'Lufthansa Technik',
  location = 'Hamburg, Germany',
  serviceType = 'General MRO',
  available = true,
  imageUrl,
  onViewProfile,
}: MROCardProps) {
  const dotColor = available ? GREEN : '#EF4444';
  const availText = available ? 'Available Now' : 'Limited Slots';

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div
        className="w-full shrink-0"
        style={{
          height: 180,
          backgroundColor: '#CBD5E1',
          ...(imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
        }}
      />

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold" style={{ color: '#1E293B' }}>{name}</span>
          <div className="flex items-center gap-1">
            <MapPin size={14} color="#94A3B8" />
            <span className="text-sm" style={{ color: '#475569' }}>{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="px-2.5 py-0.5 text-xs font-medium rounded-full"
            style={{ backgroundColor: '#EDF7F4', color: TEAL }}
          >
            {serviceType}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
            <span className="text-xs font-medium" style={{ color: dotColor }}>{availText}</span>
          </div>
        </div>

        <button
          onClick={onViewProfile}
          className="w-full h-10 text-sm font-semibold text-white rounded-lg mt-auto"
          style={{ backgroundColor: TEAL }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
