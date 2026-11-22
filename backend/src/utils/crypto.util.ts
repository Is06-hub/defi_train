// backend/src/utils/crypto.util.ts
import crypto from 'crypto';

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateSessionToken(): string {
  const randomHex = crypto.randomBytes(16).toString('hex');
  return `pv_sess_${randomHex}`;
}

export function generateClinicCode(): string {
  // Format: PV-XXXX (4 random digits)
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PV-${num}`;
}

export function generateDoctorToken(): string {
  const randomHex = crypto.randomBytes(12).toString('hex');
  return `doc_read_${randomHex}`;
}
