import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const TOKEN_COOKIE = 'akhf_token';
const USER_COOKIE = 'akhf_user';

function cookieOptions(remember = false) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  };
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, token: null, user: null });
  }

  let user = null;
  const rawUser = cookieStore.get(USER_COOKIE)?.value;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }

  return NextResponse.json({ authenticated: true, token, user });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { token, user, remember } = body ?? {};
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const options = cookieOptions(Boolean(remember));

  cookieStore.set(TOKEN_COOKIE, token, options);

  if (user != null) {
    cookieStore.set(USER_COOKIE, JSON.stringify(user), options);
  } else {
    cookieStore.delete(USER_COOKIE);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(USER_COOKIE);
  return NextResponse.json({ ok: true });
}
