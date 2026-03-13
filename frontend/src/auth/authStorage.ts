import type { AuthTokens, CurrentUser } from '../types';

const TOKENS_KEY = 'listingpilot.auth.tokens';
const USER_KEY = 'listingpilot.auth.user';
const ANON_KEY = 'listingpilot.anonymous.id';

export function getStoredTokens(): AuthTokens | null {
  const raw = window.localStorage.getItem(TOKENS_KEY);
  return raw ? JSON.parse(raw) as AuthTokens : null;
}

export function storeTokens(tokens: AuthTokens | null) {
  if (!tokens) {
    window.localStorage.removeItem(TOKENS_KEY);
    return;
  }

  window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function getStoredUser(): CurrentUser | null {
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) as CurrentUser : null;
}

export function storeUser(user: CurrentUser | null) {
  if (!user) {
    window.localStorage.removeItem(USER_KEY);
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(TOKENS_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getAnonymousId(): string {
  const existing = window.localStorage.getItem(ANON_KEY);
  if (existing) {
    return existing;
  }

  const generated = `anon-${crypto.randomUUID()}`;
  window.localStorage.setItem(ANON_KEY, generated);
  return generated;
}
