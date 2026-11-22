// backend/src/config/database.config.ts
import { Session, PainRecord } from '../types/painSession.types';
import { ClinicalReport } from '../types/report.types';

class DatabaseStore {
  private sessions: Map<string, Session> = new Map(); // key: id
  private sessionTokenIndex: Map<string, string> = new Map(); // key: sessionToken -> id
  private painRecords: Map<string, PainRecord> = new Map(); // key: id
  private sessionPainRecordIndex: Map<string, string> = new Map(); // key: sessionId -> painRecordId
  private clinicalReports: Map<string, ClinicalReport> = new Map(); // key: id
  private clinicCodeIndex: Map<string, string> = new Map(); // key: clinicCode -> id
  private recordReportIndex: Map<string, string> = new Map(); // key: recordId -> id

  // --- Session Methods ---
  public saveSession(session: Session): Session {
    this.sessions.set(session.id, { ...session });
    this.sessionTokenIndex.set(session.sessionToken, session.id);
    return session;
  }

  public getSessionById(id: string): Session | null {
    const session = this.sessions.get(id);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      session.status = 'expired';
    }
    return { ...session };
  }

  public getSessionByToken(token: string): Session | null {
    const sessionId = this.sessionTokenIndex.get(token);
    if (!sessionId) return null;
    return this.getSessionById(sessionId);
  }

  public updateSession(id: string, updates: Partial<Session>): Session | null {
    const session = this.sessions.get(id);
    if (!session) return null;

    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return { ...updated };
  }

  // --- PainRecord Methods ---
  public savePainRecord(record: PainRecord): PainRecord {
    this.painRecords.set(record.id, { ...record });
    this.sessionPainRecordIndex.set(record.sessionId, record.id);
    return record;
  }

  public getPainRecordById(id: string): PainRecord | null {
    const record = this.painRecords.get(id);
    if (!record) return null;
    return { ...record };
  }

  public getPainRecordBySessionId(sessionId: string): PainRecord | null {
    const recordId = this.sessionPainRecordIndex.get(sessionId);
    if (!recordId) return null;
    return this.getPainRecordById(recordId);
  }

  public updatePainRecord(id: string, updates: Partial<PainRecord>): PainRecord | null {
    const record = this.painRecords.get(id);
    if (!record) return null;

    const updated = {
      ...record,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.painRecords.set(id, updated);
    return { ...updated };
  }

  // --- ClinicalReport Methods (Phase 4 & 5) ---
  public saveReport(report: ClinicalReport): ClinicalReport {
    this.clinicalReports.set(report.id, { ...report });
    this.clinicCodeIndex.set(report.clinicCode, report.id);
    this.recordReportIndex.set(report.recordId, report.id);
    return report;
  }

  public getReportById(id: string): ClinicalReport | null {
    const report = this.clinicalReports.get(id);
    if (!report) return null;
    return { ...report };
  }

  public getReportByClinicCode(code: string): ClinicalReport | null {
    const reportId = this.clinicCodeIndex.get(code);
    if (!reportId) return null;
    return this.getReportById(reportId);
  }

  public getReportByRecordId(recordId: string): ClinicalReport | null {
    const reportId = this.recordReportIndex.get(recordId);
    if (!reportId) return null;
    return this.getReportById(reportId);
  }

  public clear(): void {
    this.sessions.clear();
    this.sessionTokenIndex.clear();
    this.painRecords.clear();
    this.sessionPainRecordIndex.clear();
    this.clinicalReports.clear();
    this.clinicCodeIndex.clear();
    this.recordReportIndex.clear();
  }
}

export const db = new DatabaseStore();
