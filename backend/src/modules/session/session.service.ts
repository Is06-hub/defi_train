// backend/src/modules/session/session.service.ts
import { ENV } from '../../config/env.config';
import { generateUUID, generateSessionToken } from '../../utils/crypto.util';
import { SessionModel } from './session.model';
import { AppError } from '../../middlewares/errorHandler.middleware';
import {
  CreateSessionDTO,
  CreateSessionResponse,
  SessionStatusResponse,
  Session,
  PainRecord
} from '../../types/painSession.types';

export class SessionService {
  public static async createSession(dto: CreateSessionDTO): Promise<CreateSessionResponse> {
    const sessionId = generateUUID();
    const painRecordId = generateUUID();
    const sessionToken = generateSessionToken();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ENV.SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

    const newSession: Session = {
      id: sessionId,
      sessionToken,
      status: 'in_progress',
      currentStep: 'SCREEN_2_LOCATION',
      language: dto.language || 'ar',
      clientMetadata: dto.clientMetadata,
      createdAt: now.toISOString(),
      expiresAt,
      painRecordId
    };

    const newPainRecord: PainRecord = {
      id: painRecordId,
      sessionId,
      locations: [],
      intensities: [],
      radiations: [],
      sensations: [],
      movements: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    SessionModel.create(newSession);
    SessionModel.createPainRecord(newPainRecord);

    return {
      sessionId: newSession.id,
      sessionToken: newSession.sessionToken,
      expiresAt: newSession.expiresAt,
      currentStep: newSession.currentStep,
      painRecordId: newSession.painRecordId
    };
  }

  public static async getSessionById(sessionId: string): Promise<SessionStatusResponse> {
    const session = SessionModel.findById(sessionId);

    if (!session) {
      throw new AppError(404, 'SESSION_NOT_FOUND', 'الجلسة غير مسجلة في قاعدة البيانات');
    }

    if (session.status === 'expired' || new Date(session.expiresAt) < new Date()) {
      throw new AppError(401, 'SESSION_EXPIRED', 'انتهت فترة صلاحية الجلسة المؤقتة (تجاوزت 6 ساعات)');
    }

    return {
      sessionId: session.id,
      status: session.status,
      currentStep: session.currentStep,
      painRecordId: session.painRecordId,
      isCompleted: session.status === 'completed',
      expiresAt: session.expiresAt
    };
  }
}
