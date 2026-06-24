'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from './input';
import Button from './button';
import { authenticate } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: '', password: '', role: 'CUSTOMER' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const nextErrors = {};

    if (!values.email.includes('@')) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const { user } = await authenticate(values.email, values.password);
      setMessage(`Welcome back, ${user.name}.`);
      router.push('/dashboard');
    } catch (error) {
      setMessage(error.message || 'Unable to sign in.');
    }
  };

  return (
    <form className="content-card form" onSubmit={handleSubmit} aria-label="Login form" noValidate>
      <Input
        label="Email"
        id="login-email"
        type="email"
        value={values.email}
        error={errors.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
      />

      <Input
        label="Password"
        id="login-password"
        type="password"
        value={values.password}
        error={errors.password}
        onChange={(event) => setValues({ ...values, password: event.target.value })}
      />

      <div className="field">
        <label htmlFor="login-role">Role</label>
        <select
          id="login-role"
          className="select"
          value={values.role}
          onChange={(event) => setValues({ ...values, role: event.target.value })}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
          <option value="TRAVEL_AGENT">Travel Agent</option>
        </select>
      </div>

      <Button type="submit">Login</Button>
      {message ? <p className="pill" role="status">{message}</p> : null}
    </form>
  );
}
