'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import { clearToken, useAuthUser } from '@/lib/auth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tours', label: 'Tours' },
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Admin' }
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { user } = useAuthUser();

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
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        {user ? (
          <>
            <span className="pill" aria-label="Current role">{user.role}</span>
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
