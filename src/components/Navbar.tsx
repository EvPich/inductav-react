import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, User } from 'lucide-react';
import Logo from './Logo';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';

type AuthModal = 'signin' | 'signup' | null;

const navLinks = ['Services', 'MRO Network', 'How It Works', 'Pricing', 'About'];

export default function Navbar({ onHome }: { onHome?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<AuthModal>(null);

  function openSignIn() {
    setMenuOpen(false);
    setAuthModal('signin');
  }

  function openSignUp() {
    setMenuOpen(false);
    setAuthModal('signup');
  }

  return (
    <>
      <nav className="w-full" style={{ backgroundColor: '#1C2B4A' }}>
        {/* Mobile header */}
        <div className="lg:hidden flex items-center h-14 px-4">
          <div className="flex-1">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-1 -ml-1"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <button onClick={onHome} className="cursor-pointer">
            <Logo />
          </button>
          <div className="flex-1 flex justify-end">
            <button onClick={openSignIn} className="text-white p-1 -mr-1">
              <User size={22} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            className="lg:hidden flex flex-col px-4 pb-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="py-3.5 text-sm font-medium text-white/80 border-b border-white/10 last:border-0 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-5">
              <button
                onClick={openSignIn}
                className="text-center py-2.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={openSignUp}
                className="py-3 text-sm font-semibold text-white rounded-lg"
                style={{ backgroundColor: '#57A091' }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between h-[72px] px-12">
          <div className="flex items-center gap-8">
            <button onClick={onHome} className="shrink-0 cursor-pointer">
              <Logo />
            </button>
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openSignIn}
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={openSignUp}
              className="px-6 py-[10px] text-sm font-semibold text-white rounded-[6px] transition-colors"
              style={{ backgroundColor: '#57A091' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#478A7C')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#57A091')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Modals — rendered at document.body via portal to avoid stacking context issues */}
      {authModal === 'signin' && createPortal(
        <SignInModal
          onClose={() => setAuthModal(null)}
          onSwitchToSignUp={() => setAuthModal('signup')}
        />,
        document.body
      )}
      {authModal === 'signup' && createPortal(
        <SignUpModal
          onClose={() => setAuthModal(null)}
          onSwitchToSignIn={() => setAuthModal('signin')}
        />,
        document.body
      )}
    </>
  );
}
