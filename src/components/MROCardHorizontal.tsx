import { MapPin } from 'lucide-react';

export interface MROCardHorizontalProps {
  name?: string;
  location?: string;
  available?: boolean;
  imageUrl?: string;
}

const GREEN = '#22C55E';

export default function MROCardHorizontal({
  name = 'Facility Name',
  location = 'Location',
  available = true,
  imageUrl,
}: MROCardHorizontalProps) {
  return (
    <div
      className="rounded-xl overflow-hidden flex"
      style={{ height: 120, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div
        className="shrink-0"
        style={{
          width: 120,
          height: '100%',
          backgroundColor: '#CBD5E1',
          ...(imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
        }}
      />

      <div className="flex flex-col justify-center gap-2 p-3 flex-1 min-w-0">
        <span className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{name}</span>
        <div className="flex items-center gap-1">
          <MapPin size={12} color="#94A3B8" />
          <span className="text-xs truncate" style={{ color: '#475569' }}>{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-[7px] h-[7px] rounded-full shrink-0"
            style={{ backgroundColor: available ? GREEN : '#94A3B8' }}
          />
          <span className="text-xs font-medium" style={{ color: available ? GREEN : '#94A3B8' }}>
            {available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
}
