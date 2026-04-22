import { Phone } from 'lucide-react';

const platformLinks = ['Search MROs', 'Book Slots', 'Track Orders', 'Analytics'];
const serviceLinks = ['General MRO', 'Engine Overhaul', 'Landing Gear', 'Painting'];
const companyLinks = ['About Us', 'Careers', 'Blog', 'Contact'];
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 w-full">
      <div className="max-w-[1360px] mx-auto px-10 py-16">
        {/* Top */}
        <div className="flex gap-16 mb-12">
          {/* Brand */}
          <div className="w-[280px] shrink-0">
            <div className="w-[140px] h-8 bg-blue-500 rounded mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-base">InductAV</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 w-[260px]">
              The world's leading aviation MRO marketplace. Connecting airlines with certified
              maintenance facilities worldwide.
            </p>
          </div>

          {/* Columns */}
          <div className="flex gap-16 flex-1">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white mb-1">Platform</span>
              {platformLinks.map((l) => (
                <a key={l} href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white mb-1">Services</span>
              {serviceLinks.map((l) => (
                <a key={l} href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white mb-1">Company</span>
              {companyLinks.map((l) => (
                <a key={l} href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white mb-1">Legal</span>
              {legalLinks.map((l) => (
                <a key={l} href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-6 flex items-center justify-between">
          <span className="text-xs text-slate-500">© 2026 InductAV. All rights reserved.</span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Phone size={14} />
            <span>+1 (800) 555-0199</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
