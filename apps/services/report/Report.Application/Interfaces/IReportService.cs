using Report.Application.Dtos;
using Report.Domain.Entities;
using SharedKernel;

namespace Report.Application.Interfaces
{
  public interface IReportService
  {
    // GET ADMIN
    Task<PageResult<ReportListItemDto>> AdminFilterReportsAsync(ReportFilterDtos filter, string adminId);
    Task<ReportDetailResponseDtos> AdminGetReportByIdAsync(string reportId, string adminId);

    // GET USER
    Task<PageResult<ReportListItemDto>> GetMyReportsAsync(string userId);
    Task<ReportDetailResponseDtos> GetReportDetailForUserAsync(string reportId, string userId, string role);

    // Dashboard
    Task<ReportDashboardResponseDtos> GetDashboardAsync(string adminId);

    // CREATE
    Task<ReportDetailResponseDtos> CreateReportAsync(ReportClientRequestDtos dto);
    Task<ReportEvidence> AddEvidenceAsync(AddReportEvidenceDtos dto, string userId);
    Task<ReportComment> AddCommentAsync(AddReportCommentDtos dto, string userId);
    Task<ReportAction> AddActionAsync(ReportAdminActionRequestDtos dto, string adminId);

    // UPDATE
    Task<ReportDetailResponseDtos> UpdateReportStatusAsync(string reportId, UpdateReportStatusDtos dto, string adminId);

    // DELETE 
    Task SoftDeleteReportAsync(string reportId, string requesterId, string role);
    Task HardDeleteReportAsync(string reportId, string adminId);
  }
}
