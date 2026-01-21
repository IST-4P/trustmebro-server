import {
  ReportCategory,
  ReportStatus,
  ReportTargetType,
} from '@common/interfaces/proto-types/report';

export const TARGET_TYPE_MAP: Record<string, ReportTargetType> = {
  USER: ReportTargetType.REPORT_TARGET_USER,
  SELLER: ReportTargetType.REPORT_TARGET_SELLER,
  PRODUCT: ReportTargetType.REPORT_TARGET_PRODUCT,
  ORDER: ReportTargetType.REPORT_TARGET_ORDER,
  MESSAGE: ReportTargetType.REPORT_TARGET_MESSAGE,
  REVIEW: ReportTargetType.REPORT_TARGET_REVIEW,
};

export const CATEGORY_MAP: Record<string, ReportCategory> = {
  SCAM: ReportCategory.REPORT_CATEGORY_SCAM,
  FRAUD: ReportCategory.REPORT_CATEGORY_FRAUD,
  FAKE: ReportCategory.REPORT_CATEGORY_FAKE,
  HARASSMENT: ReportCategory.REPORT_CATEGORY_HARASSMENT,
  SPAM: ReportCategory.REPORT_CATEGORY_SPAM,
};

export const STATUS_MAP: Record<string, ReportStatus> = {
  PENDING: ReportStatus.REPORT_STATUS_PENDING,
  REVIEWING: ReportStatus.REPORT_STATUS_REVIEWING,
  RESOLVED: ReportStatus.REPORT_STATUS_RESOLVED,
  REJECTED: ReportStatus.REPORT_STATUS_REJECTED,
};

// Reverse maps: number → string
export const REVERSE_TARGET_TYPE_MAP = Object.fromEntries(
  Object.entries(TARGET_TYPE_MAP).map(([k, v]) => [v, k])
) as Record<ReportTargetType, string>;

export const REVERSE_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
) as Record<ReportCategory, string>;

export const REVERSE_STATUS_MAP = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k])
) as Record<ReportStatus, string>;
