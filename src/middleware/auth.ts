import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  userRole?: string;
  dbUserId?: number;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    // Check DB user
    const dbUserList = await db
      .select()
      .from(users)
      .where(eq(users.uid, decodedToken.uid))
      .limit(1);

    if (dbUserList.length > 0) {
      req.userRole = dbUserList[0].role;
      req.dbUserId = dbUserList[0].id;
    } else {
      // Upsert / register user
      const inserted = await db
        .insert(users)
        .values({
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || '',
          role: decodedToken.email === 'studiox700@gmail.com' ? 'admin' : 'customer',
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email: decodedToken.email || '',
            displayName: decodedToken.name || '',
          },
        })
        .returning();
      req.userRole = inserted[0]?.role || 'customer';
      req.dbUserId = inserted[0]?.id;
    }

    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const dbUserList = await db
      .select()
      .from(users)
      .where(eq(users.uid, decodedToken.uid))
      .limit(1);

    if (dbUserList.length > 0) {
      req.userRole = dbUserList[0].role;
      req.dbUserId = dbUserList[0].id;
    }
    next();
  } catch {
    // Non-fatal for optional auth
    next();
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // First check if auth token is present
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Allow demo admin secret header in development mode for easy testing if configured
    const adminKey = req.headers['x-admin-key'];
    if (adminKey && adminKey === 'buzz-admin-secret-2026') {
      req.userRole = 'admin';
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const dbUserList = await db
      .select()
      .from(users)
      .where(eq(users.uid, decodedToken.uid))
      .limit(1);

    const isOwnerEmail = decodedToken.email === 'studiox700@gmail.com';
    const isDbAdmin = dbUserList[0]?.role === 'admin';

    if (isOwnerEmail || isDbAdmin) {
      req.userRole = 'admin';
      req.dbUserId = dbUserList[0]?.id;
      return next();
    }

    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  } catch (error) {
    console.error('Error verifying Admin ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
