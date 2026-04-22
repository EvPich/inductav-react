import { useState } from 'react';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import MROProfilePage from './pages/MROProfilePage';
import RequestSlotChatPage from './pages/RequestSlotChatPage';

type Page = 'home' | 'search' | 'profile' | 'chat';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  // Simple in-memory router for demo purposes
  const nav: Record<Page, string> = {
    home: 'Homepage',
    search: 'Search Results',
    profile: 'MRO Profile',
    chat: 'Request Slot – Chat',
  };

  return (
    <div>
      {/* Page switcher (dev only) */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-white border border-slate-200 rounded-2xl shadow-lg p-2">
        {(Object.keys(nav) as Page[]).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              page === p ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {nav[p]}
          </button>
        ))}
      </div>

      {page === 'home' && <HomePage onSearch={() => setPage('search')} onHome={() => setPage('home')} />}
      {page === 'search' && <SearchResultsPage onHome={() => setPage('home')} />}
      {page === 'profile' && <MROProfilePage onHome={() => setPage('home')} />}
      {page === 'chat' && <RequestSlotChatPage onHome={() => setPage('home')} />}
    </div>
  );
}
