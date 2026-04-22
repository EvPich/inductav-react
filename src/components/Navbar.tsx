import Logo from './Logo';

const navLinks = ['Services', 'MRO Network', 'How It Works', 'Pricing', 'About'];

export default function Navbar({ onHome }: { onHome?: () => void }) {
  return (
    <nav
      className="w-full h-[72px] flex items-center justify-between px-4 md:px-8 lg:px-12"
      style={{ backgroundColor: '#1C2B4A' }}
    >
      <div className="flex items-center gap-4 lg:gap-8">
        <button onClick={onHome} className="shrink-0 cursor-pointer">
          <Logo />
        </button>
        <div className="hidden lg:flex items-center gap-8">
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

      <div className="flex items-center gap-2 md:gap-4">
        <a href="#" className="hidden md:block text-sm font-medium text-white/90 hover:text-white transition-colors">
          Log In
        </a>
        <button
          className="px-4 md:px-6 py-[10px] text-sm font-semibold text-white rounded-[6px] transition-colors"
          style={{ backgroundColor: '#57A091' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#478A7C')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#57A091')}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
