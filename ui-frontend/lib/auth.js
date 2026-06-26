'use client';

import { useEffect, useState } from 'react';
import {
  clearSession,
  getStoredUser,
  getToken,
  saveStoredUser,
  saveToken,
  subscribeAuthState
} from './session';
import { fetchCurrentUser, loginRequest, registerRequest } from './api';

/**
 * Strip the Spring Security "ROLE_" prefix so the frontend can compare
 * plain role names such as "CUSTOMER", "ADMIN", "TRAVEL_AGENT".
 */
function stripRolePrefix(role) {
  if (typeof role === 'string' && role.startsWith('ROLE_')) {
    return role.substring(5);
  }
  return role || 'CUSTOMER';
}

/**
 * Normalise the user object coming from the backend so that every
 * consumer sees a consistent { role, roles } shape with unprefixed values.
 */
function normalizeRole(user) {
  if (!user) {
    return null;
  }

  // Backend returns roles as Set<String> (e.g. ["ROLE_CUSTOMER"])
  const rawRoles = Array.isArray(user.roles) ? user.roles : [];
  const roles = rawRoles.map(stripRolePrefix);

  // Prefer the first role in the set; fall back to a plain "role" field
  const role = roles[0] || stripRolePrefix(user.role) || 'CUSTOMER';

  return {
    ...user,
    role,
    roles
  };
}

export function createTokenFromUser(user) {
  return btoa(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }));
}

export function getCurrentUser() {
  const storedUser = getStoredUser();
  if (storedUser) {
    return normalizeRole(storedUser);
  }

  const token = getToken();
  if (!token) {
    return null;
  }

  // Attempt to decode a simple base64-encoded payload (dev fallback)
  try {
    return normalizeRole(JSON.parse(atob(token)));
  } catch {
    return null;
  }
}

export function clearToken() {
  clearSession();
}

export { getToken } from './session';

export async function login(email, password) {
  const authResponse = await loginRequest(email, password);
  saveToken(authResponse.token);

  const user = normalizeRole(await fetchCurrentUser(authResponse.token));
  saveStoredUser(user);
  return { token: authResponse.token, user };
}

export async function register({ name, email, password, role = 'CUSTOMER' }) {
  await registerRequest({
    name,
    email,
    password,
    roles: [role]
  });

  return login(email, password);
}

export async function authenticate(email, password) {
  return login(email, password);
}

/**
 * React hook that keeps the authenticated user in sync across tabs
 * and after login / logout actions.
 */
export function useAuthUser() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(() => {
    return Boolean(getToken()) && !getCurrentUser();
  });

  useEffect(() => {
    let active = true;

    const syncAuthState = async () => {
      const cachedUser = getCurrentUser();
      if (cachedUser) {
        if (active) {
          setUser(cachedUser);
          setLoading(false);
        }
        return;
      }

      const token = getToken();
      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const remoteUser = normalizeRole(await fetchCurrentUser(token));
        if (active) {
          saveStoredUser(remoteUser);
          setUser(remoteUser);
        }
      } catch {
        clearSession();
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    syncAuthState();
    const unsubscribe = subscribeAuthState(() => {
      syncAuthState();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user, loading, isAuthenticated: Boolean(user) };
}
