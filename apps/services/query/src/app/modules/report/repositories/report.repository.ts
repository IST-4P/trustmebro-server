import {
  GetManyReportsRequest,
  GetReportRequest,
} from '@common/interfaces/models/report';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyReportsRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    let where: Prisma.ReportViewWhereInput = {
      reporterId: data?.reporterId || undefined,
      targetId: data?.targetId || undefined,
      targetType: data?.targetType || undefined,
      category: data?.category || undefined,
      status: data?.status || undefined,
    };

    const [totalItems, reports] = await Promise.all([
      this.prismaService.reportView.count({
        where,
      }),
      this.prismaService.reportView.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          reporterId: true,
          targetType: true,
          category: true,
          title: true,
          status: true,
        },
      }),
    ]);
    return {
      reports,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  findById(data: GetReportRequest) {
    return this.prismaService.reportView.findUnique({
      where: { id: data.id },
    });
  }

  async create(data: Prisma.ReportViewCreateInput) {
    return this.prismaService.reportView.create({
      data,
    });
  }

  async update(data: Prisma.ReportViewUpdateInput) {
    return this.prismaService.reportView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.ReportViewWhereUniqueInput) {
    return this.prismaService.reportView.delete({
      where: { id: data.id as string },
    });
  }
}
