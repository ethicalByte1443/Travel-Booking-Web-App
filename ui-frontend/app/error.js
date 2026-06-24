'use client';

import ErrorMessage from '@/components/error-message';

export default function Error({ error, reset }) {
  return <ErrorMessage error={error} onRetry={reset} />;
}
