'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from './input';
import Button from './button';
import { register } from '@/lib/auth';

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const nextErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!values.email.includes('@')) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (values.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
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
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      });
      setMessage('Account created successfully.');
      router.push('/dashboard');
    } catch (error) {
      setMessage(error.message || 'Unable to create account.');
    }
  };

  return (
    <form className="content-card form" onSubmit={handleSubmit} aria-label="Register form" noValidate>
      <Input
        label="Name"
        id="register-name"
        value={values.name}
        error={errors.name}
        onChange={(event) => setValues({ ...values, name: event.target.value })}
      />
      <Input
        label="Email"
        id="register-email"
        type="email"
        value={values.email}
        error={errors.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
      />
      <Input
        label="Password"
        id="register-password"
        type="password"
        value={values.password}
        error={errors.password}
        onChange={(event) => setValues({ ...values, password: event.target.value })}
      />
      <div className="field">
        <label htmlFor="register-role">Role</label>
        <select
          id="register-role"
          className="select"
          value={values.role}
          onChange={(event) => setValues({ ...values, role: event.target.value })}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
          <option value="TRAVEL_AGENT">Travel Agent</option>
        </select>
      </div>
      <Button type="submit">Create account</Button>
      {message ? <p className="pill" role="status">{message}</p> : null}
    </form>
  );
}
