'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Loader from './loader';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const router = useRouter();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push('/login');
      setStatus('blocked');
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
      setStatus('blocked');
      return;
    }

    setStatus('ready');
  }, [allowedRoles, router]);

  if (status !== 'ready') {
    return <Loader label="Checking access" />;
  }

  return children;
}
