using Microsoft.EntityFrameworkCore;
using Report.Application.Dtos;
using Report.Application.Interfaces;
using Report.Domain.Entities;
using Report.Domain.Enums;

namespace Report.Infrastructure.Persistence
{
  public class ReportRepository : IReportRepository
  {
    private readonly ReportDbContext _dbContext;

    public ReportRepository(ReportDbContext dbContext)
    {
      _dbContext = dbContext;
    }

    #region GET Methods

    public async Task<List<ReportEntity>> FilterReportsAsync(ReportFilterDtos filter)
    {
      var query = _dbContext.Reports
        .AsNoTracking()
        .AsQueryable();

      if (filter.Status.HasValue)
        query = query.Where(r => r.Status == filter.Status.Value);

      if (filter.Category.HasValue)
        query = query.Where(r => r.Category == filter.Category.Value);

      if (filter.TargetType.HasValue)
        query = query.Where(r => r.TargetType == filter.TargetType.Value);

      if (!string.IsNullOrWhiteSpace(filter.AssignedAdminId))
        query = query.Where(r => r.AssignedAdminId == filter.AssignedAdminId);

      if (!string.IsNullOrWhiteSpace(filter.ReporterId))
        query = query.Where(r => r.ReporterId == filter.ReporterId);

      if (!string.IsNullOrWhiteSpace(filter.TargetId))
        query = query.Where(r => r.TargetId == filter.TargetId);

      if (filter.FromDate.HasValue)
        query = query.Where(r => r.CreatedAt >= filter.FromDate.Value);

      if (filter.ToDate.HasValue)
        query = query.Where(r => r.CreatedAt <= filter.ToDate.Value);

      return await query
        .OrderByDescending(r => r.CreatedAt)
        .ToListAsync();
    }

    public async Task<List<ReportEntity>> GetReportsByReporterIdAsync(string reporterId)
    {
      return await _dbContext.Reports
        .Where(r => r.ReporterId == reporterId)
        .AsNoTracking()
        .OrderByDescending(r => r.CreatedAt)
        .ToListAsync();
    }

    public async Task<ReportEntity?> GetReportByIdAsync(string reportId)
    {
      return await _dbContext.Reports
        .Include(r => r.Evidences.OrderByDescending(e => e.CreatedAt))
        .Include(r => r.Comments.OrderByDescending(c => c.CreatedAt))
        .Include(r => r.History.OrderByDescending(h => h.CreatedAt))
        .Include(r => r.Actions.OrderByDescending(a => a.CreatedAt))
        .AsNoTracking()
        .FirstOrDefaultAsync(r => r.Id == reportId);
    }

    public async Task<List<ReportHistory>> GetReportHistoryAsync(string reportId)
    {
      return await _dbContext.ReportHistories
        .Where(rh => rh.ReportId == reportId)
        .AsNoTracking()
        .OrderByDescending(rh => rh.CreatedAt)
        .ToListAsync();
    }

    #endregion

    #region CREATE Methods

    public async Task<ReportEntity> CreateAsync(ReportEntity report)
    {
      await _dbContext.Reports.AddAsync(report);
      await _dbContext.SaveChangesAsync();
      return report;
    }

    public async Task<ReportEvidence> AddEvidenceAsync(ReportEvidence evidence)
    {
      await _dbContext.ReportEvidences.AddAsync(evidence);
      await _dbContext.SaveChangesAsync();
      return evidence;
    }

    public async Task<ReportComment> AddCommentAsync(ReportComment comment)
    {
      await _dbContext.ReportComments.AddAsync(comment);
      await _dbContext.SaveChangesAsync();
      return comment;
    }

    public async Task<ReportAction> AddActionAsync(ReportAction action)
    {
      await _dbContext.ReportActions.AddAsync(action);
      await _dbContext.SaveChangesAsync();
      return action;
    }

    public async Task AddHistoryAsync(ReportHistory history)
    {
      await _dbContext.ReportHistories.AddAsync(history);
      await _dbContext.SaveChangesAsync();
    }

    #endregion

    #region UPDATE Methods

    public async Task UpdateAsync(ReportEntity updated)
    {
      _dbContext.Reports.Update(updated);
      await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateStatusAsync(string reportId, ReportStatus status)
    {
      await _dbContext.Reports
        .Where(r => r.Id == reportId)
        .ExecuteUpdateAsync(s => s
          .SetProperty(r => r.Status, status)
          .SetProperty(r => r.UpdatedAt, DateTime.UtcNow));
    }

    #endregion

    #region DELETE Methods

    public async Task<bool> SoftDeleteAsync(string reportId)
    {
      var result = await _dbContext.Reports
        .Where(r => r.Id == reportId)
        .ExecuteUpdateAsync(s => s
          .SetProperty(r => r.IsDeleted, true)
          .SetProperty(r => r.DeletedAt, DateTime.UtcNow));

      return result > 0;
    }

    public async Task<bool> HardDeleteAsync(string reportId)
    {
      var report = await _dbContext.Reports
        .IgnoreQueryFilters()
        .Include(r => r.Evidences)
        .Include(r => r.Comments)
        .Include(r => r.History)
        .Include(r => r.Actions)
        .FirstOrDefaultAsync(r => r.Id == reportId);

      if (report == null)
        return false;

      _dbContext.Reports.Remove(report);
      await _dbContext.SaveChangesAsync();
      return true;
    }

    public async Task<ReportEntity?> GetReportByIdIncludingDeletedAsync(string reportId)
    {
      return await _dbContext.Reports
        .IgnoreQueryFilters()
        .Include(r => r.Evidences.OrderByDescending(e => e.CreatedAt))
        .Include(r => r.Comments.OrderByDescending(c => c.CreatedAt))
        .Include(r => r.History.OrderByDescending(h => h.CreatedAt))
        .Include(r => r.Actions.OrderByDescending(a => a.CreatedAt))
        .AsNoTracking()
        .FirstOrDefaultAsync(r => r.Id == reportId);
    }

    #endregion

    #region Dashboard Methods

    public async Task<int> CountAllAsync()
    {
      return await _dbContext.Reports.CountAsync();
    }

    public async Task<int> CountByStatusAsync(ReportStatus status)
    {
      return await _dbContext.Reports.CountAsync(r => r.Status == status);
    }

    #endregion
  }
}
