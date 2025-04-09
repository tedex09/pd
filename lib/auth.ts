import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key);
  return payload;
}

export async function login(phone: string) {
  const token = await encrypt({ phone });
  cookies().set('token', token, { httpOnly: true });
}

export async function logout() {
  cookies().delete('token');
}

export async function getSession() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  try {
    const session = await decrypt(token);
    return session;
  } catch (error) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = await getSession();
  if (!session) return;

  // Extend session by 24 hours
  const token = await encrypt(session);
  request.cookies.set('token', token);
}