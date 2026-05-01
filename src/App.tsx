import { useState } from 'react';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import MROProfilePage from './pages/MROProfilePage';
import RequestSlotChatPage from './pages/RequestSlotChatPage';
import MRODashboardPage from './pages/MRODashboardPage';
import MROChatsPage from './pages/MROChatsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import MROManagerPage from './pages/MROManagerPage';
import MROListPage, { type MROListItem } from './pages/MROListPage';
import BayManagerPage from './pages/BayManagerPage';
import BookingsPage from './pages/BookingsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import FacilitiesListPage from './pages/FacilitiesListPage';

type Page = 'home' | 'search' | 'profile' | 'chat' | 'dashboard' | 'mro-chats' | 'booking-detail' | 'mro-manager' | 'mro-list' | 'bay-manager' | 'bookings' | 'facilities' | 'facilities-list';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedMRO, setSelectedMRO] = useState<MROListItem | undefined>(undefined);

  // Simple in-memory router for demo purposes
  const nav: Record<Page, string> = {
    home: 'Homepage',
    search: 'Search Results',
    profile: 'MRO Profile',
    chat: 'Request Slot – Chat',
    dashboard: 'MRO Dashboard',
    'mro-chats': 'MRO Chats',
    'booking-detail': 'Booking Detail',
    'mro-manager': 'Bay Manager',
    'mro-list':    'MRO List',
    'bay-manager': 'Bay Manager (MRO)',
    'bookings':         'Bookings',
    'facilities':       'Facility Detail',
    'facilities-list':  'Facilities',
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
        <MRODashboardPage onChats={() => setPage('mro-chats')} onViewBooking={() => setPage('booking-detail')} onManager={() => setPage('mro-list')} onBookings={() => setPage('bookings')} onFacilities={() => setPage('facilities-list')} />
      </>
    );
  }

  if (page === 'booking-detail') {
    return (
      <>
        {fullViewportSwitcher}
        <BookingDetailPage onBack={() => setPage('dashboard')} onChats={() => setPage('mro-chats')} onBookings={() => setPage('bookings')} onFacilities={() => setPage('facilities-list')} onManager={() => setPage('mro-list')} />
      </>
    );
  }

  if (page === 'mro-chats') {
    return (
      <>
        {fullViewportSwitcher}
        <MROChatsPage onDashboard={() => setPage('dashboard')} onManager={() => setPage('mro-list')} onBookings={() => setPage('bookings')} onFacilities={() => setPage('facilities-list')} />
      </>
    );
  }

  if (page === 'mro-list') {
    return (
      <>
        {fullViewportSwitcher}
        <MROListPage
          onDashboard={() => setPage('dashboard')}
          onFacilities={() => setPage('facilities-list')}
          onChats={() => setPage('mro-chats')}
          onBookings={() => setPage('bookings')}
          onViewBays={(mro) => { setSelectedMRO(mro); setPage('bay-manager'); }}
        />
      </>
    );
  }

  if (page === 'bay-manager') {
    return (
      <>
        {fullViewportSwitcher}
        <BayManagerPage
          mro={selectedMRO}
          onBack={() => setPage('mro-list')}
          onDashboard={() => setPage('dashboard')}
          onFacilities={() => setPage('facilities-list')}
          onChats={() => setPage('mro-chats')}
          onBookings={() => setPage('bookings')}
        />
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
          onFacilities={() => setPage('facilities-list')}
          onMROList={() => setPage('mro-list')}
        />
      </>
    );
  }

  if (page === 'facilities-list') {
    return (
      <>
        {fullViewportSwitcher}
        <FacilitiesListPage
          onDashboard={() => setPage('dashboard')}
          onManager={() => setPage('mro-list')}
          onChats={() => setPage('mro-chats')}
          onBookings={() => setPage('bookings')}
          onViewFacility={() => setPage('facilities')}
        />
      </>
    );
  }

  if (page === 'facilities') {
    return (
      <>
        {fullViewportSwitcher}
        <FacilitiesPage
          onBack={() => setPage('facilities-list')}
          onDashboard={() => setPage('dashboard')}
          onFacilities={() => setPage('facilities-list')}
          onManager={() => setPage('mro-list')}
          onChats={() => setPage('mro-chats')}
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
          onManager={() => setPage('mro-list')}
          onViewBooking={() => setPage('booking-detail')}
          onFacilities={() => setPage('facilities-list')}
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
