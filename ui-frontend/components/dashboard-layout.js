'use client';

import Link from 'next/link';
import { useAuthUser } from '@/lib/auth';

const ADMIN_ROLES = ['ADMIN', 'TRAVEL_AGENT'];

export default function DashboardLayout({ title, subtitle, children }) {
  const { user } = useAuthUser();
  const isAdmin = user && ADMIN_ROLES.includes(user.role);

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/bookings', label: 'Bookings' },
    { href: '/feedback', label: 'Feedback' }
  ];

  if (isAdmin) {
    links.push({ href: '/admin', label: 'Admin' });
  }

  return (
    <section className="dashboard-layout">
      <header className="content-card stack-small">
        <span className="eyebrow">{user?.role || 'Guest'}</span>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </header>

      <div className="dashboard-grid">
        <aside className="content-card dashboard-sidebar" aria-label="Dashboard navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="sidebar-link">
              {link.label}
            </Link>
          ))}
        </aside>

        <div>{children}</div>
      </div>
    </section>
  );
}
