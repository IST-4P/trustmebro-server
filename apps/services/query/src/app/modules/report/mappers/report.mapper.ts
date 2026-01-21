import {
  REVERSE_CATEGORY_MAP,
  REVERSE_TARGET_TYPE_MAP,
} from '@common/interfaces/mappers/report.mapper';
import {
  CreateReportResponse,
  UpdateStatusReportResponse,
} from '@common/interfaces/models/report';
import { Prisma } from '@prisma-client/query';

export const CreateReportMapper = (
  data: CreateReportResponse
): Prisma.ReportViewCreateInput => {
  return {
    id: data.ReportId,
    reporterId: data.ReporterId,
    targetId: data.TargetId,

    targetType: REVERSE_TARGET_TYPE_MAP[data.TargetType],
    category: REVERSE_CATEGORY_MAP[data.Category],
    status: data.Status.toUpperCase() as any,

    title: data.Title,
    description: data.Description,

    createdAt: data.CreatedAt,
  };
};

export const UpdateStatusReportMapper = (
  data: UpdateStatusReportResponse
): Prisma.ReportViewUpdateInput => {
  return {
    id: data.ReportId,
    status: data.NewStatus.toUpperCase() as any,
    updatedAt: data.UpdatedAt,
    note: data.Note || null,
  };
};
