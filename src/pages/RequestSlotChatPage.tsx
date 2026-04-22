import { useState } from 'react';
import {
  ArrowLeft,
  Paperclip,
  Send,
  Clock3,
  CircleCheckBig,
  FileText,
  Download,
  BadgeCheck,
  Star,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const TEAL = '#57A091';
const TEAL_HOVER = '#478A7C';
const NAVY = '#1C2B4A';

interface Message {
  id: string;
  sender: 'mro' | 'airline' | 'system';
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'system',
    text: 'Slot request submitted for Lufthansa Technik Shannon · C-Check · Boeing 737-800 · April 9, 2026',
    time: '10:02 AM',
  },
  {
    id: '2',
    sender: 'mro',
    text: 'Hello! Thank you for your slot request. We have received your inquiry for a C-Check on Boeing 737-800 (EI-FRG) for April 9, 2026. Let me check our hangar availability.',
    time: '10:05 AM',
  },
  {
    id: '3',
    sender: 'mro',
    text: 'Good news — we have capacity available during your requested window. Our C-Check capability for the 737-800 includes all MPD tasks, SBs, and AD compliance. Estimated duration is 21 days. Shall I prepare a formal quote?',
    time: '10:07 AM',
  },
  {
    id: '4',
    sender: 'airline',
    text: 'That would be great. We also need to include a cabin modification scope — installing 4 additional emergency exit rows. Can you accommodate that in the same visit?',
    time: '10:22 AM',
  },
  {
    id: '5',
    sender: 'mro',
    text: "Absolutely, we can integrate the cabin modification into the C-Check package. Our cabin team is certified for this work. I'll include it in the quote.",
    time: '10:25 AM',
  },
];

export default function RequestSlotChatPage({ onHome, onBack }: { onHome?: () => void; onBack?: () => void }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: 'airline', text: input.trim(), time: 'Now' },
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onHome={onHome} />

      <div className="flex flex-col lg:flex-row flex-1 max-w-[1440px] w-full mx-auto overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white min-w-0">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-5 border-b border-slate-200 shrink-0">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: TEAL }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TEAL_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.color = TEAL)}
            >
              <ArrowLeft size={18} />
              Back to Profile
            </button>
            <span className="text-base font-bold text-slate-900">Slot Request</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">Online</span>
            </div>
          </div>

          {/* Booking Context */}
          <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: NAVY }}
            >
              LT
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[15px] font-semibold text-slate-900">Lufthansa Technik Shannon</span>
              <span className="text-xs text-slate-500">
                Shannon, Ireland · C-Check · Boeing 737-800 · April 9, 2026
              </span>
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold shrink-0">
              <Clock3 size={14} />
              Pending
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-5">
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs rounded-full text-center max-w-[500px]">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMRO = msg.sender === 'mro';
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isMRO ? 'justify-start' : 'justify-end'}`}>
                  {isMRO && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ backgroundColor: NAVY }}
                    >
                      LT
                    </div>
                  )}
                  <div
                    className={`max-w-[60%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isMRO ? 'bg-slate-100 text-slate-800 rounded-bl-sm' : 'text-white rounded-br-sm'
                    }`}
                    style={!isMRO ? { backgroundColor: TEAL } : {}}
                  >
                    {msg.text}
                    <p className={`text-[10px] mt-1 ${isMRO ? 'text-slate-400' : 'text-white/60'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            <div className="flex items-end gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ backgroundColor: NAVY }}
              >
                LT
              </div>
              <div className="px-4 py-3 bg-slate-100 rounded-2xl rounded-bl-sm flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Input Bar */}
          <div className="h-[68px] flex items-center gap-3 px-4 border-t border-slate-200 shrink-0 bg-white">
            <button className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <Paperclip size={22} />
            </button>
            <div className="flex-1 h-11 flex items-center bg-slate-100 rounded-xl px-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder-slate-400"
              />
            </div>
            <button
              onClick={sendMessage}
              className="w-11 h-11 flex items-center justify-center text-white rounded-xl transition-colors shrink-0"
              style={{ backgroundColor: TEAL }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="w-full lg:w-[360px] shrink-0 flex flex-col overflow-y-auto bg-white border-t lg:border-t-0 border-slate-200">
          <div className="flex flex-col gap-0 divide-y divide-slate-100">
            {/* Booking Summary */}
            <div className="p-6 flex flex-col gap-4">
              <h2 className="text-base font-bold text-slate-900">Booking Summary</h2>
              {[
                { label: 'Service', value: 'C-Check' },
                { label: 'Aircraft', value: 'Boeing 737-800' },
                { label: 'Registration', value: 'EI-FRG' },
                { label: 'Requested Date', value: 'April 9, 2026' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-500">{label}</span>
                  <span className="text-[13px] font-semibold text-slate-800">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-500">Status</span>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  <Clock3 size={11} />
                  Pending
                </span>
              </div>
            </div>

            {/* MRO Facility */}
            <div className="p-6 flex flex-col gap-3">
              <h2 className="text-base font-bold text-slate-900">MRO Facility</h2>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: NAVY }}
                >
                  LT
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">Lufthansa Technik Shannon</span>
                  <span className="text-xs text-slate-500">Shannon, Ireland</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-semibold text-slate-800">4.8</span>
                <span className="text-xs text-slate-500">(127 reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck size={14} className="shrink-0" style={{ color: TEAL }} />
                <span className="text-xs font-medium text-slate-600">EASA Part 145 · FAA Certified</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 flex flex-col gap-3">
              <h2 className="text-base font-bold text-slate-900">Actions</h2>
              <button
                className="w-full h-[42px] flex items-center justify-center gap-2 text-white text-sm font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: TEAL }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
              >
                <CircleCheckBig size={16} />
                Confirm Booking
              </button>
              <button className="w-full h-[42px] flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
                <FileText size={16} />
                Request Formal Quote
              </button>
            </div>

            {/* Shared Files */}
            <div className="p-6 flex flex-col gap-3">
              <h2 className="text-base font-bold text-slate-900">Shared Files</h2>
              {[
                { name: 'C-Check Scope of Work.pdf', size: '2.4 MB' },
                { name: 'Aircraft Technical Log.pdf', size: '1.1 MB' },
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <FileText size={18} style={{ color: TEAL }} className="shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-semibold text-slate-800 truncate">{file.name}</span>
                    <span className="text-[11px] text-slate-400">{file.size}</span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
