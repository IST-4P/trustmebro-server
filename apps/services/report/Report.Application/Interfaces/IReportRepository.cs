using Report.Application.Dtos;
using Report.Domain.Entities;
using Report.Domain.Enums;
using SharedKernel;

namespace Report.Application.Interfaces
{
    public interface IReportRepository
    {
    // GET
    Task<List<ReportEntity>> FilterReportsAsync(ReportFilterDtos filter);
    Task<List<ReportEntity>> GetReportsByReporterIdAsync(string reporterId);
    Task<ReportEntity?> GetReportByIdAsync(string reportId);
    Task<ReportEntity?> GetReportByIdIncludingDeletedAsync(string reportId);
    Task<List<ReportHistory>> GetReportHistoryAsync(string reportId);

    // CREATE
    Task<ReportEntity> CreateAsync(ReportEntity report);
    Task<ReportEvidence> AddEvidenceAsync(ReportEvidence evidence);
    Task<ReportComment> AddCommentAsync(ReportComment comment);
    Task<ReportAction> AddActionAsync(ReportAction action);
    Task AddHistoryAsync(ReportHistory history);


    // UPDATE
    Task UpdateAsync(ReportEntity updated);
    Task UpdateStatusAsync(string reportId, ReportStatus status);

    // DELETE
    Task<bool> SoftDeleteAsync(string reportId);
    Task<bool> HardDeleteAsync(string reportId);

    // Dashboard
    Task<int> CountAllAsync();
    Task<int> CountByStatusAsync(ReportStatus status);
  }
}
