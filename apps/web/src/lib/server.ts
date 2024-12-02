'use server';
import { cookies } from 'next/headers';

export async function createToken(token: string) {
  const oneDay = 14 * 24 * 60 * 60 * 1000;
  cookies().set('token', token, { expires: Date.now() + oneDay });
}
export async function createRole(role: string) {
  cookies().set('role', role);
}

export async function createUserId(userId: string) {
  cookies().set('userId', userId);
}

export async function getToken() {
  return cookies().get('token')?.value;
}

export async function getRole() {
  return cookies().get('role')?.value;
}

export async function getUserId() {
  return cookies().get('userId')?.value;
}

export async function deleteToken() {
  cookies().delete('token');
  cookies().delete('role');
  cookies().delete('userId');
}
