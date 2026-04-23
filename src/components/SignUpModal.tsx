import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const TEAL_LIGHT = '#EDF7F4';
const NAVY = '#1E293B';
const MUTED = '#94A3B8';
const SECONDARY = '#475569';
const BORDER = '#E2E8F0';
const BG_INPUT = '#F5F7FA';

type Role = 'operator' | 'mro';

const roles: { key: Role; label: string; desc: string }[] = [
  { key: 'operator', label: 'Aircraft Operator', desc: 'Book MRO slots for your fleet' },
  { key: 'mro', label: 'MRO Representative', desc: 'Manage your facility & slots' },
];

const textFields = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Smith' },
  { id: 'company', label: 'Company / Organization', type: 'text', placeholder: 'Airline or MRO name' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
] as const;

export default function SignUpModal({
  onClose,
  onSwitchToSignIn,
}: {
  onClose: () => void;
  onSwitchToSignIn: () => void;
}) {
  const [role, setRole] = useState<Role>('operator');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full flex flex-col bg-white overflow-y-auto"
        style={{ maxWidth: 520, maxHeight: '90vh', borderRadius: 32, padding: 40, gap: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute transition-colors hover:opacity-50"
          style={{ top: 20, right: 20 }}
        >
          <X size={22} color={MUTED} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img src="/logo-dark.png" alt="InductAV" className="h-10 w-auto object-contain" />
          <div className="flex flex-col gap-1.5 pt-1">
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Create your account</h2>
            <p className="text-sm" style={{ color: MUTED }}>Join the leading aviation MRO booking platform</p>
          </div>
        </div>

        {/* Role selector */}
        <div className="flex gap-3">
          {roles.map(({ key, label, desc }) => {
            const selected = role === key;
            return (
              <button
                key={key}
                onClick={() => setRole(key)}
                className="flex-1 flex flex-col gap-2 text-left transition-all"
                style={{
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor: selected ? TEAL_LIGHT : '#FFFFFF',
                  border: `${selected ? 2 : 1}px solid ${selected ? TEAL : BORDER}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: selected ? TEAL : '#CBD5E1' }}
                >
                  {selected && (
                    <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: TEAL }} />
                  )}
                </div>
                <span className="text-sm font-semibold" style={{ color: NAVY }}>{label}</span>
                <span className="text-xs" style={{ color: SECONDARY }}>{desc}</span>
              </button>
            );
          })}
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          {textFields.map(({ id, label, type, placeholder }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <label className="text-[13px]" style={{ color: SECONDARY }}>{label}</label>
              <div
                className="flex items-center h-[46px] px-4 rounded-[10px]"
                style={{ backgroundColor: BG_INPUT, border: `1px solid ${BORDER}` }}
              >
                <input
                  type={type}
                  placeholder={placeholder}
                  className="flex-1 text-sm bg-transparent outline-none"
                  style={{ color: NAVY }}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px]" style={{ color: SECONDARY }}>Password</label>
            <div
              className="flex items-center h-[46px] px-4 rounded-[10px]"
              style={{ backgroundColor: BG_INPUT, border: `1px solid ${BORDER}` }}
            >
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: NAVY }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="ml-2 shrink-0 transition-colors hover:opacity-70"
                style={{ color: MUTED }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <button
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-2.5 text-left"
        >
          <div
            className="w-[18px] h-[18px] rounded shrink-0 flex items-center justify-center mt-0.5 transition-colors"
            style={{
              backgroundColor: agreed ? TEAL : '#FFFFFF',
              border: `1.5px solid ${agreed ? TEAL : '#CBD5E1'}`,
            }}
          >
            {agreed && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span className="text-[13px]" style={{ color: SECONDARY }}>
            I agree to the{' '}
            <span style={{ color: TEAL, fontWeight: 600 }}>Terms of Service</span> and{' '}
            <span style={{ color: TEAL, fontWeight: 600 }}>Privacy Policy</span>
          </span>
        </button>

        {/* CTA */}
        <button
          className="w-full flex items-center justify-center h-[46px] text-white font-bold rounded-[10px] transition-colors"
          style={{ fontSize: 15, backgroundColor: TEAL }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
        >
          Create Account
        </button>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-[13px]" style={{ color: SECONDARY }}>Already have an account?</span>
          <button
            onClick={onSwitchToSignIn}
            className="text-[13px] font-semibold"
            style={{ color: TEAL }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
