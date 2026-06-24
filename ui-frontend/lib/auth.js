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

function encodeToken(payload) {
  return btoa(JSON.stringify(payload));
}

function decodeToken(token) {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

function normalizeRole(user) {
  if (!user) {
    return null;
  }

  const roles = Array.isArray(user.roles) ? user.roles : [];
  const role = user.role || roles[0] || 'CUSTOMER';

  return {
    ...user,
    role,
    roles
  };
}

export function createTokenFromUser(user) {
  return encodeToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
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

  return normalizeRole(decodeToken(token));
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
