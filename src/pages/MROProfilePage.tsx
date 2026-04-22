import { useState } from 'react';
import {
  MapPin,
  Star,
  BadgeCheck,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const stats = [
  { value: '35+', label: 'Years Experience' },
  { value: '1,200+', label: 'Completed Jobs' },
  { value: '4.8', label: 'Average Rating' },
  { value: '48h', label: 'Avg. Response Time' },
];

const services = [
  ['C-Check', 'D-Check', 'A-Check'],
  ['Line Maintenance', 'Cabin Modification', 'Avionics'],
  ['Engine Removal', 'AOG Support', 'CAMO Services'],
];

const certifications = ['EASA Part 145', 'FAA Repair Station', 'ISO 9001:2015', 'AS/EN 9110', 'TCCA Approved'];

const aircraftTags = ['Boeing 737', 'Boeing 757', 'Airbus A320', 'Airbus A330', 'Embraer E-Jet', 'ATR 72'];

const reviews = [
  {
    author: "James O'Brien",
    role: 'Director of Maintenance, Ryanair',
    rating: 5,
    text: 'Exceptional quality of work on our 737-800 C-check. The team completed the work 3 days ahead of schedule with zero punch items.',
  },
  {
    author: 'Maria Santos',
    role: 'Fleet Technical Manager, TAP Air Portugal',
    rating: 4,
    text: 'Great facility with skilled engineers. The cabin modification project was delivered on time and within budget.',
  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type SlotStatus = 'available' | 'booked' | 'partial';

const calendarWeeks: SlotStatus[][] = [
  ['available', 'available', 'booked', 'available', 'partial', 'booked', 'booked'],
  ['available', 'booked', 'available', 'available', 'booked', 'booked', 'available'],
  ['partial', 'available', 'available', 'booked', 'available', 'booked', 'available'],
  ['available', 'available', 'partial', 'available', 'available', 'booked', 'partial'],
];

const slotColor: Record<SlotStatus, string> = {
  available: 'bg-emerald-100 text-emerald-700',
  booked: 'bg-red-100 text-red-500',
  partial: 'bg-amber-100 text-amber-600',
};

const dayNumbers = [
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 1, 2, 3, 4],
];

export default function MROProfilePage({ onHome }: { onHome?: () => void }) {
  const [serviceType, setServiceType] = useState('');
  const [aircraftType, setAircraftType] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onHome={onHome} />

      {/* Breadcrumb */}
      <div className="max-w-[1360px] mx-auto px-10 h-12 flex items-center gap-2 text-[13px]">
        <a href="#" className="font-medium text-blue-600 hover:underline">Home</a>
        <span className="text-slate-400">/</span>
        <a href="#" className="font-medium text-blue-600 hover:underline">Search Results</a>
        <span className="text-slate-400">/</span>
        <span className="font-medium text-slate-700">Lufthansa Technik Shannon</span>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[340px] bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative z-10 max-w-[1360px] mx-auto px-10 h-full flex items-center justify-between">
          {/* Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300">
                <BadgeCheck size={12} />
                Verified Facility
              </span>
            </div>
            <h1 className="text-[32px] font-bold text-white">Lufthansa Technik Shannon</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm text-slate-300">Shannon, Ireland</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm text-slate-300 ml-1">4.8 (127 reviews)</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-2 px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl transition-colors">
              <MessageCircle size={18} />
              Request Slot &amp; Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1360px] mx-auto px-10 py-10 flex gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Overview */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-xl font-bold text-slate-900">Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lufthansa Technik Shannon is one of Europe's leading MRO providers, specialising in
              heavy maintenance for narrow-body and wide-body aircraft. Located at Shannon Airport,
              we offer comprehensive C-check and D-check capabilities alongside line maintenance and
              cabin modification services.
            </p>
            <div className="grid grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 bg-slate-50 rounded-xl p-4">
                  <span className="text-2xl font-bold text-blue-600">{s.value}</span>
                  <span className="text-xs text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900">Services Offered</h2>
            <div className="flex flex-col gap-3">
              {services.map((row, i) => (
                <div key={i} className="flex gap-3">
                  {row.map((svc) => (
                    <span key={svc} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[13px] font-medium rounded-lg">
                      <BadgeCheck size={13} />
                      {svc}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Availability Calendar */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Slot Availability</h2>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronLeft size={16} className="text-slate-600" />
                </button>
                <span className="text-sm font-medium text-slate-700">April 2026</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-slate-500 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex flex-col gap-1">
              {calendarWeeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1 h-10">
                  {week.map((status, di) => (
                    <button
                      key={di}
                      className={`flex items-center justify-center rounded-lg text-xs font-medium transition-opacity hover:opacity-80 ${slotColor[status]}`}
                    >
                      {dayNumbers[wi][di]}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-500">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs text-slate-500">Partially Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-xs text-slate-500">Fully Booked</span>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-slate-800">4.8</span>
                  <span className="text-sm text-slate-500">(127)</span>
                </div>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:underline">See All</button>
            </div>
            {reviews.map((rev) => (
              <div key={rev.author} className="flex flex-col gap-2 pb-4 border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-900">{rev.author}</span>
                    <p className="text-xs text-slate-500">{rev.role}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div className="w-[380px] shrink-0 flex flex-col gap-5">
          {/* Quick Book */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 sticky top-4">
            <h2 className="text-lg font-bold text-slate-900">Request a Slot</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-700">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full h-[42px] px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="">Select service...</option>
                <option>C-Check</option>
                <option>D-Check</option>
                <option>Line Maintenance</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-700">Aircraft Type</label>
              <select
                value={aircraftType}
                onChange={(e) => setAircraftType(e.target.value)}
                className="w-full h-[42px] px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="">Select aircraft...</option>
                <option>Boeing 737-800</option>
                <option>Airbus A320</option>
                <option>Airbus A330</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-700">Preferred Date</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full h-[42px] px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-blue-400"
              />
            </div>

            <button className="w-full h-[46px] bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
              <MessageCircle size={16} />
              Request Slot &amp; Chat
            </button>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                LT
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">Online now</span>
                <span className="text-[11px] text-slate-500">Usually replies in under 1 hour</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-900">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-blue-600 shrink-0" />
                <span className="text-sm font-medium text-slate-800">{cert}</span>
              </div>
            ))}
          </div>

          {/* Supported Aircraft */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-900">Supported Aircraft</h2>
            <div className="flex flex-wrap gap-2">
              {aircraftTags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900">Contact &amp; Location</h2>
            <div className="w-full h-[160px] bg-slate-200 rounded-xl flex items-center justify-center text-sm text-slate-500">
              Map Placeholder
            </div>
            {[
              { icon: <MapPin size={16} />, text: 'Shannon Airport, Co. Clare, V14 X085, Ireland' },
              { icon: <Phone size={16} />, text: '+353 61 472 222' },
              { icon: <Mail size={16} />, text: 'bookings@lufthansa-technik.ie' },
              { icon: <Globe size={16} />, text: 'lufthansa-technik.com' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
                <span className="text-[13px] text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
