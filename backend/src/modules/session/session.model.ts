// backend/src/modules/session/session.model.ts
import { db } from '../../config/database.config';
import { Session, PainRecord } from '../../types/painSession.types';

export const SessionModel = {
  create(session: Session): Session {
    return db.saveSession(session);
  },

  findById(id: string): Session | null {
    return db.getSessionById(id);
  },

  findByToken(token: string): Session | null {
    return db.getSessionByToken(token);
  },

  update(id: string, updates: Partial<Session>): Session | null {
    return db.updateSession(id, updates);
  },

  createPainRecord(record: PainRecord): PainRecord {
    return db.savePainRecord(record);
  },

  findPainRecordBySessionId(sessionId: string): PainRecord | null {
    return db.getPainRecordBySessionId(sessionId);
  }
};
