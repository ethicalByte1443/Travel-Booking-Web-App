'use client';

import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/admin', label: 'Admin' }
];

export default function DashboardLayout({ title, subtitle, children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

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
