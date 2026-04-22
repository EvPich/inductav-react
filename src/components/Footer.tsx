import { Phone } from 'lucide-react';
import Logo from './Logo';

const cols = [
  {
    heading: 'Platform',
    links: ['Search MROs', 'Book Slots', 'Track Orders', 'Analytics'],
  },
  {
    heading: 'Services',
    links: ['General MRO', 'Engine Overhaul', 'Landing Gear', 'Painting'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Contact'],
  },
  {
    heading: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
];

export default function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: '#1C2B4A' }}>
      <div className="px-20 pt-16 pb-8">
        {/* Top */}
        <div className="flex justify-between gap-16 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 w-[280px] shrink-0">
            <Logo />
            <p className="text-sm leading-relaxed w-[260px]" style={{ color: '#94A3B8' }}>
              The world's leading aviation MRO marketplace. Connecting airlines with certified
              maintenance facilities worldwide.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-16">
            {cols.map(({ heading, links }) => (
              <div key={heading} className="flex flex-col gap-3">
                <span className="text-sm font-bold text-white mb-1">{heading}</span>
                {links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: '#94A3B8' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex items-center justify-between pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            © 2026 InductAV. All rights reserved.
          </span>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
            <Phone size={14} />
            <span>+1 (800) 555-0199</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
