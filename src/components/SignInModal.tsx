import { useState } from 'react';
import { X, LogIn, Eye, EyeOff } from 'lucide-react';

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

export default function SignInModal({
  onClose,
  onSwitchToSignUp,
}: {
  onClose: () => void;
  onSwitchToSignUp: () => void;
}) {
  const [role, setRole] = useState<Role>('operator');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full flex flex-col bg-white overflow-y-auto"
        style={{ maxWidth: 480, maxHeight: '90vh', borderRadius: 28, padding: 40, gap: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center transition-colors hover:bg-slate-200"
          style={{ top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: BG_INPUT }}
        >
          <X size={18} color={SECONDARY} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img src="/logo-dark.png" alt="InductAV" className="h-10 w-auto object-contain" />
          <div className="flex flex-col gap-1.5 pt-1">
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Welcome back</h2>
            <p className="text-sm" style={{ color: MUTED }}>Sign in to your InductAV account</p>
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
                <span className="text-sm font-bold" style={{ color: NAVY }}>{label}</span>
                <span className="text-xs" style={{ color: SECONDARY }}>{desc}</span>
              </button>
            );
          })}
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: SECONDARY }}>Email Address</label>
            <div
              className="flex items-center h-[46px] px-3.5 rounded-[10px]"
              style={{ backgroundColor: BG_INPUT, border: `1px solid ${BORDER}` }}
            >
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: NAVY }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: SECONDARY }}>Password</label>
            <div
              className="flex items-center h-[46px] px-3.5 rounded-[10px]"
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

          <div className="flex items-center justify-between">
            <button onClick={() => setRemember(!remember)} className="flex items-center gap-2">
              <div
                className="w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 transition-colors"
                style={{
                  backgroundColor: remember ? TEAL : '#FFFFFF',
                  border: `2px solid ${remember ? TEAL : '#CBD5E1'}`,
                }}
              >
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-[13px]" style={{ color: SECONDARY }}>Remember me</span>
            </button>
            <button className="text-[13px] font-semibold" style={{ color: TEAL }}>
              Forgot password?
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          className="w-full flex items-center justify-center gap-2 h-[46px] text-white font-bold rounded-[10px] transition-colors"
          style={{ fontSize: 15, backgroundColor: TEAL }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
        >
          <LogIn size={18} />
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
          <span className="text-xs font-medium" style={{ color: MUTED }}>or continue with</span>
          <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
        </div>

        {/* Social */}
        <div className="flex gap-3">
          {[
            { label: 'Google', glyph: 'G', color: '#4285F4' },
            { label: 'Microsoft', glyph: '⊞', color: '#00A4EF' },
          ].map(({ label, glyph, color }) => (
            <button
              key={label}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[10px] bg-white transition-colors hover:bg-slate-50"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color }}>{glyph}</span>
              <span className="text-sm font-semibold" style={{ color: NAVY }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-[13px]" style={{ color: MUTED }}>Don't have an account?</span>
          <button
            onClick={onSwitchToSignUp}
            className="text-[13px] font-bold"
            style={{ color: TEAL }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
