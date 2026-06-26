'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import { clearToken, useAuthUser } from '@/lib/auth';

const ADMIN_ROLES = ['ADMIN', 'TRAVEL_AGENT'];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { user } = useAuthUser();

  const isAdmin = user && ADMIN_ROLES.includes(user.role);

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  return (
    <header className="nav" aria-label="Main navigation">
      <Link href="/" className="nav-brand" aria-label="Travel Booking Web App home">
        <span className="brand-mark" aria-hidden="true" />
        <span>Travel Booking</span>
      </Link>

      <nav className="nav-links" aria-label="Primary">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/tours" className="nav-link">Tours</Link>
        <Link href="/about" className="nav-link">About</Link>
        {user && <Link href="/dashboard" className="nav-link">Dashboard</Link>}
        {isAdmin && <Link href="/admin" className="nav-link">Admin</Link>}
      </nav>

      <div className="nav-actions">
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {user ? (
          <>
            <span className="pill" aria-label="Current user">{user.name}</span>
            <span className="badge badge-accent" aria-label="Current role">{user.role}</span>
            <button type="button" className="button ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="button primary">Login</Link>
            <Link href="/register" className="button ghost">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
