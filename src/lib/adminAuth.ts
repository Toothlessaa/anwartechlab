import { supabase } from './supabase';

const ADMIN_TOKEN_KEY = 'admin_session_token';

export type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
};

type LoginResponse = {
  token: string;
  admin: AdminUser;
};

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const { data, error } = await supabase.rpc('admin_login', {
    p_email: email.trim(),
    p_password: password,
  });

  if (error) throw error;

  const result = data as LoginResponse | null;
  if (!result?.token || !result.admin) throw new Error('Login failed');

  setAdminToken(result.token);
  return result.admin;
}

export async function verifyAdminSession(): Promise<AdminUser | null> {
  const token = getAdminToken();
  if (!token) return null;

  const { data, error } = await supabase.rpc('verify_admin_session', {
    p_token: token,
  });

  if (error || !data) {
    clearAdminToken();
    return null;
  }

  return data as AdminUser;
}

export async function logoutAdmin() {
  const token = getAdminToken();
  if (token) {
    await supabase.rpc('admin_logout', { p_token: token });
  }
  clearAdminToken();
}
