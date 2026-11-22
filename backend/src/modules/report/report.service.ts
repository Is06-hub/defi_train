// backend/src/modules/report/report.service.ts
import { db } from '../../config/database.config';
import { AppError } from '../../middlewares/errorHandler.middleware';
import { generateUUID, generateClinicCode } from '../../utils/crypto.util';
import { ENV } from '../../config/env.config';
import { ClinicalReport, ClinicalReportSummary } from '../../types/report.types';

export class ReportService {
  public static async generateReport(recordId: string, includeAudio: boolean = true, snapshot?: string) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    const reportId = `rep_${generateUUID()}`;
    const clinicCode = generateClinicCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ENV.REPORT_TTL_HOURS * 60 * 60 * 1000).toISOString();

    // Summarize clinical telemetry
    const primaryZone = record.locations[0]?.bodyPart || 'general';
    const maxIntensity = record.intensities?.reduce((max, i) => Math.max(max, i.level), 0) || 5;
    const hasRadiation = record.radiations?.some((r) => r.hasRadiation) || false;
    const dominantSensations = Array.from(new Set(record.sensations?.map((s) => s.type) || []));
    const peakHour = record.timing?.peakHours?.[0] || record.timing?.onsetHours?.[0] || 7;
    const severeMovements = record.movements
      ?.filter((m) => m.severity === 'severe' || m.severityRating === 'severe')
      .map((m) => m.movementId) || [];

    const summary: ClinicalReportSummary = {
      primaryPainZone: primaryZone,
      maxIntensityLevel: maxIntensity,
      radiationPresent: hasRadiation,
      dominantSensations,
      peakHour,
      severelyRestrictedMovements: severeMovements
    };

    const newReport: ClinicalReport = {
      id: reportId,
      recordId,
      clinicCode,
      doctorShareHash: generateUUID(),
      summary,
      visualSnapshotUrl: snapshot || `/v1/reports/${reportId}/snapshot`,
      pdfDownloadUrl: `/v1/reports/${reportId}/pdf`,
      isLocked: false,
      createdAt: now.toISOString(),
      expiresAt
    };

    db.saveReport(newReport);

    return {
      reportId: newReport.id,
      recordId: newReport.recordId,
      clinicCode: newReport.clinicCode,
      summary: newReport.summary,
      visualSnapshotUrl: newReport.visualSnapshotUrl,
      pdfDownloadUrl: newReport.pdfDownloadUrl,
      expiresAt: newReport.expiresAt
    };
  }

  public static async getReportById(reportId: string) {
    const report = db.getReportById(reportId);
    if (!report) {
      throw new AppError(404, 'REPORT_NOT_FOUND', 'تقرير الاستشارة المطلوب غير موجود أو انتهت صلاحيته');
    }

    const fullRecord = db.getPainRecordById(report.recordId);

    return {
      reportId: report.id,
      clinicCode: report.clinicCode,
      summary: report.summary,
      fullRecord,
      createdAt: report.createdAt,
      expiresAt: report.expiresAt,
      isLocked: report.isLocked
    };
  }
}
