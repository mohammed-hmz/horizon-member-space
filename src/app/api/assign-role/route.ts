import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, setUserRole } from '@/lib/firebase/admin';
import { getSession } from '@/actions/auth-action';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(session);
    console.log('Decoded Token:', decodedToken);
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { uid, role } = await request.json();

    if (!uid || !role || !['user', 'member', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await setUserRole(uid, role);

    return NextResponse.json({ success: true, message: 'Role assigned' });
  } catch (error) {
    console.error('Role assignment error:', error);
    return NextResponse.json({ error: 'Failed to assign role' }, { status: 500 });
  }
}
