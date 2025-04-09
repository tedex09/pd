import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // No middleware needed since we're using client-side auth
  return NextResponse.next();
}