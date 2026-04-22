
interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  return (
    <nav
      className={`w-full h-[72px] flex items-center justify-between px-10 ${
        transparent ? 'bg-transparent' : 'bg-white border-b border-slate-200'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <div className="w-[150px] h-[50px] bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xl tracking-tight">InductAV</span>
        </div>
        <div className="flex items-center gap-6">
          {['Services', 'MRO Network', 'How It Works', 'Pricing', 'About'].map((link) => (
            <a
              key={link}
              href="#"
              className={`text-sm font-medium transition-colors ${
                transparent
                  ? 'text-white/90 hover:text-white'
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          className={`text-sm font-medium ${
            transparent ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          Log In
        </a>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
}
