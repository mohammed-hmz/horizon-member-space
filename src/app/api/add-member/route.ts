import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { createUser } from '@/lib/firebase/admin';
export async function POST(request: NextRequest) {
  try {
    const { email,name } = await request.json();

    if (!email ||!adminAuth) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await createUser(email,name);
    return NextResponse.json({ success: true, message: 'Role assigned' });
  } catch (error) {
    console.error('Role assignment error:', error);
    return NextResponse.json({ error: 'Failed to add Member' }, { status: 500 });
  }
}
