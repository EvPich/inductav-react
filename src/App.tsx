import { useState } from 'react';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import MROProfilePage from './pages/MROProfilePage';
import RequestSlotChatPage from './pages/RequestSlotChatPage';
import MRODashboardPage from './pages/MRODashboardPage';
import MROChatsPage from './pages/MROChatsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import MROManagerPage from './pages/MROManagerPage';
import BookingsPage from './pages/BookingsPage';

type Page = 'home' | 'search' | 'profile' | 'chat' | 'dashboard' | 'mro-chats' | 'booking-detail' | 'mro-manager' | 'bookings';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  // Simple in-memory router for demo purposes
  const nav: Record<Page, string> = {
    home: 'Homepage',
    search: 'Search Results',
    profile: 'MRO Profile',
    chat: 'Request Slot – Chat',
    dashboard: 'MRO Dashboard',
    'mro-chats': 'MRO Chats',
    'booking-detail': 'Booking Detail',
    'mro-manager': 'MRO Manager',
    'bookings':    'Bookings',
  };

  const fullViewportSwitcher = (
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
  );

  if (page === 'dashboard') {
    return (
      <>
        {fullViewportSwitcher}
        <MRODashboardPage onChats={() => setPage('mro-chats')} onViewBooking={() => setPage('booking-detail')} onManager={() => setPage('mro-manager')} onBookings={() => setPage('bookings')} />
      </>
    );
  }

  if (page === 'booking-detail') {
    return (
      <>
        {fullViewportSwitcher}
        <BookingDetailPage onBack={() => setPage('dashboard')} onChats={() => setPage('mro-chats')} onBookings={() => setPage('bookings')} />
      </>
    );
  }

  if (page === 'mro-chats') {
    return (
      <>
        {fullViewportSwitcher}
        <MROChatsPage onDashboard={() => setPage('dashboard')} />
      </>
    );
  }

  if (page === 'mro-manager') {
    return (
      <>
        {fullViewportSwitcher}
        <MROManagerPage
          onDashboard={() => setPage('dashboard')}
          onChats={() => setPage('mro-chats')}
          onViewBooking={() => setPage('booking-detail')}
          onBookings={() => setPage('bookings')}
        />
      </>
    );
  }

  if (page === 'bookings') {
    return (
      <>
        {fullViewportSwitcher}
        <BookingsPage
          onDashboard={() => setPage('dashboard')}
          onChats={() => setPage('mro-chats')}
          onManager={() => setPage('mro-manager')}
          onViewBooking={() => setPage('booking-detail')}
        />
      </>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto">
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

      {page === 'home' && <HomePage onSearch={() => setPage('search')} onHome={() => setPage('home')} onViewProfile={() => setPage('profile')} onDashboard={() => setPage('dashboard')} />}
      {page === 'search' && <SearchResultsPage onHome={() => setPage('home')} onViewProfile={() => setPage('profile')} onDashboard={() => setPage('dashboard')} />}
      {page === 'profile' && <MROProfilePage onHome={() => setPage('home')} onRequestSlot={() => setPage('chat')} onSearchResults={() => setPage('search')} onDashboard={() => setPage('dashboard')} />}
      {page === 'chat' && <RequestSlotChatPage onHome={() => setPage('home')} onBack={() => setPage('profile')} />}
    </div>
  );
}
