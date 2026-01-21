using Report.Application.Dtos;
using Report.Application.Exceptions;
using Report.Application.Interfaces;
using Report.Application.Validators;
using Report.Application.Contracts;
using Report.Application.Constants;
using Report.Domain.Entities;
using Report.Domain.Enums;
using SharedInfrastructure.Kafka.Abstractions;
using SharedKernel;
using SharedInfrastructure.Kafka.Producer;

namespace Report.Application.Service
{
  public class ReportService : IReportService
  {
    private readonly IReportRepository _repo;
    private readonly IKafkaProducer _kafka;

    public ReportService(IReportRepository repo, IKafkaProducer kafka)
    {
      _repo = repo;
      _kafka = kafka;
    }

    #region READ Methods
    // Admin Filter Reports
    public async Task<PageResult<ReportListItemDto>> AdminFilterReportsAsync(ReportFilterDtos filter, string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new ReportAccessDeniedException("Admin ID is required");

      var reports = await _repo.FilterReportsAsync(filter);

      var items = reports.Select(r => new ReportListItemDto
      {
        Id = r.Id,
        ReporterId = r.ReporterId,
        TargetId = r.TargetId,
        Status = r.Status,
        Category = r.Category,
        TargetType = r.TargetType,
        CreatedAt = r.CreatedAt
      }).ToList();

      return new PageResult<ReportListItemDto>
      {
        Items = items,
        Total_Items = items.Count,
        Page = 1,
        Limit = items.Count
      };
    }

    // Get Report by Id for Admin
    public async Task<ReportDetailResponseDtos> AdminGetReportByIdAsync(string reportId, string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new ReportAccessDeniedException("Admin ID is required");

      var report = await _repo.GetReportByIdAsync(reportId)
        ?? throw new ReportNotFoundException(reportId);

      return MapToDetailResponse(report);
    }

    // Get My Reports for User
    public async Task<PageResult<ReportListItemDto>> GetMyReportsAsync(string userId)
    {
      if (string.IsNullOrWhiteSpace(userId))
        throw new ReportValidationException("userId", "User ID is required");

      var reports = await _repo.GetReportsByReporterIdAsync(userId);

      var items = reports.Select(r => new ReportListItemDto
      {
        Id = r.Id,
        ReporterId = r.ReporterId,
        TargetId = r.TargetId,
        Status = r.Status,
        Category = r.Category,
        TargetType = r.TargetType,
        CreatedAt = r.CreatedAt
      }).ToList();

      return new PageResult<ReportListItemDto>
      {
        Items = items,
        Total_Items = items.Count,
        Page = 1,
        Limit = items.Count
      };
    }
    // Get Detail Report for User
    public async Task<ReportDetailResponseDtos> GetReportDetailForUserAsync(string reportId, string userId, string role)
    {
      var report = await _repo.GetReportByIdAsync(reportId)
        ?? throw new ReportNotFoundException(reportId);

      // Check if user is admin or report owner
      if (role != "admin" && report.ReporterId != userId)
        throw new ReportAccessDeniedException(reportId, userId);

      return MapToDetailResponse(report);
    }

    // Get Dashboard 
    public async Task<ReportDashboardResponseDtos> GetDashboardAsync(string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new ReportAccessDeniedException("Admin ID is required");

      var total = await _repo.CountAllAsync();
      var pending = await _repo.CountByStatusAsync(ReportStatus.Pending);
      var reviewing = await _repo.CountByStatusAsync(ReportStatus.Reviewing);
      var resolved = await _repo.CountByStatusAsync(ReportStatus.Resolved);
      var rejected = await _repo.CountByStatusAsync(ReportStatus.Rejected);

      return new ReportDashboardResponseDtos
      {
        TotalReports = total,
        PendingReports = pending,
        InProgressReports = reviewing,
        ResolvedReports = resolved,
        RejectedReports = rejected
      };
    }

    #endregion

    #region CREATE Methods

    public async Task<ReportDetailResponseDtos> CreateReportAsync(ReportClientRequestDtos dto)
    {
      var validation = ReportValidators.CreateReportValidator.Validate(dto);
      if (!validation.IsValid)
        throw new ReportValidationException(validation.ErrorMessage);

      var report = new ReportEntity
      {
        ReporterId = dto.ReporterId,
        TargetId = dto.TargetId,
        TargetType = dto.TargetType,
        Category = dto.Category,
        Title = dto.Title,
        Description = dto.Description,
        Status = ReportStatus.Pending,
        AssignedAdminId = string.Empty
      };

      var created = await _repo.CreateAsync(report);

      await _kafka.EmitAsync(
        ReportTopics.ReportCreated,
        new ReportCreatedEvent(
          created.Id.ToString(),
          created.ReporterId,
          created.TargetId,
          (int)created.TargetType,
          (int)created.Category,
          created.Title,
          created.Description,
          created.Status.ToString(),
          created.CreatedAt
        )
      );

      return MapToDetailResponse(created);
    }

    public async Task<ReportEvidence> AddEvidenceAsync(AddReportEvidenceDtos dto, string userId)
    {
      var validation = ReportValidators.AddEvidenceValidator.Validate(dto);
      if (!validation.IsValid)
        throw new ReportValidationException(validation.ErrorMessage);

      var report = await _repo.GetReportByIdAsync(dto.ReportId)
        ?? throw new ReportNotFoundException(dto.ReportId);

      var evidence = new ReportEvidence
      {
        ReportId = dto.ReportId,
        Url = dto.Url,
        EvidenceType = dto.EvidenceType,
        Note = dto.Note
      };

      return await _repo.AddEvidenceAsync(evidence);
    }

    public async Task<ReportComment> AddCommentAsync(AddReportCommentDtos dto, string userId)
    {
      var validation = ReportValidators.AddCommentValidator.Validate(dto);
      if (!validation.IsValid)
        throw new ReportValidationException(validation.ErrorMessage);

      var report = await _repo.GetReportByIdAsync(dto.ReportId)
        ?? throw new ReportNotFoundException(dto.ReportId);

      var comment = new ReportComment
      {
        ReportId = dto.ReportId,
        UserId = dto.UserId,
        Role = dto.Role,
        Comment = dto.Comment
      };

      return await _repo.AddCommentAsync(comment);
    }

    public async Task<ReportAction> AddActionAsync(ReportAdminActionRequestDtos dto, string adminId)
    {
      var validation = ReportValidators.AddActionValidator.Validate(dto);
      if (!validation.IsValid)
        throw new ReportValidationException(validation.ErrorMessage);

      var report = await _repo.GetReportByIdAsync(dto.ReportId)
        ?? throw new ReportNotFoundException(dto.ReportId);

      var action = new ReportAction
      {
        ReportId = dto.ReportId,
        AdminId = dto.AdminId,
        ActionType = dto.ActionType,
        Reason = dto.Note
      };

      return await _repo.AddActionAsync(action);
    }

    #endregion

    #region UPDATE Methods

    public async Task<ReportDetailResponseDtos> UpdateReportStatusAsync(string reportId, UpdateReportStatusDtos dto, string adminId)
    {
      var validation = ReportValidators.UpdateStatusValidator.Validate(dto);
      if (!validation.IsValid)
        throw new ReportValidationException(validation.ErrorMessage);

      var report = await _repo.GetReportByIdAsync(reportId)
        ?? throw new ReportNotFoundException(reportId);

      // Validate status transition
      ValidateStatusTransition(report.Status, dto.NewStatus);

      var oldStatus = report.Status;

      var history = new ReportHistory
      {
        ReportId = reportId,
        OldStatus = report.Status,
        NewStatus = dto.NewStatus,
        AdminId = dto.AdminId,
        Note = dto.Note
      };

      await _repo.AddHistoryAsync(history);
      await _repo.UpdateStatusAsync(reportId, dto.NewStatus);

      await _kafka.EmitAsync(
        ReportTopics.ReportStatusUpdated,
        new ReportStatusUpdatedEvent(
            reportId,
            oldStatus.ToString(),
            dto.NewStatus.ToString(),
            dto.AdminId,
            dto.Note,
            DateTime.UtcNow
        )
      );

      // Auto-delete when status changes to Rejected
      if (dto.NewStatus == ReportStatus.Rejected)
      {
        await SoftDeleteReportAsync(reportId, dto.AdminId, "admin");
      }

      var updatedReport = await _repo.GetReportByIdAsync(reportId);
      return MapToDetailResponse(updatedReport!);
    }

    #endregion

    #region DELETE Methods

    public async Task SoftDeleteReportAsync(string reportId, string requesterId, string role)
    {
      var report = await _repo.GetReportByIdAsync(reportId)
        ?? throw new ReportNotFoundException(reportId);

      // Admin can soft delete any report
      if (role == "admin")
      {
        var deleted = await _repo.SoftDeleteAsync(reportId);
        if (deleted)
        {
          await _kafka.EmitAsync(
            ReportTopics.ReportDeleted,
            new ReportDeletedEvent(
              reportId,
              requesterId,
              "Admin soft deleted",
              false,
              DateTime.UtcNow
            )
          );
        }
        return;
      }

      // Client can only soft delete their own pending reports
      if (report.ReporterId != requesterId)
        throw new ReportAccessDeniedException(reportId, requesterId);

      if (report.Status != ReportStatus.Pending)
        throw new ReportOperationException("Delete", "Only pending reports can be deleted by the reporter");

      var softDeleted = await _repo.SoftDeleteAsync(reportId);
      if (softDeleted)
      {
        await _kafka.EmitAsync(
          ReportTopics.ReportDeleted,
          new ReportDeletedEvent(
            reportId,
            requesterId,
            "User soft deleted own report",
            false,
            DateTime.UtcNow
          )
        );
      }
    }

    public async Task HardDeleteReportAsync(string reportId, string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new ReportAccessDeniedException("Admin ID is required for hard delete");

      var report = await _repo.GetReportByIdIncludingDeletedAsync(reportId)
        ?? throw new ReportNotFoundException(reportId);

      var hardDeleted = await _repo.HardDeleteAsync(reportId);
      if (hardDeleted)
      {
        await _kafka.EmitAsync(
          ReportTopics.ReportDeleted,
          new ReportDeletedEvent(
            reportId,
            adminId,
            "Admin permanently deleted report",
            true,
            DateTime.UtcNow
          )
        );
      }
    }

    #endregion

    #region Private Helper Methods

    private static void ValidateStatusTransition(ReportStatus currentStatus, ReportStatus newStatus)
    {
      // Define valid transitions
      var validTransitions = new Dictionary<ReportStatus, ReportStatus[]>
      {
        { ReportStatus.Pending, new[] { ReportStatus.Reviewing, ReportStatus.Rejected, ReportStatus.Resolved } },
        { ReportStatus.Reviewing, new[] { ReportStatus.Resolved, ReportStatus.Rejected, ReportStatus.Pending } },
        { ReportStatus.Resolved, Array.Empty<ReportStatus>() },
        { ReportStatus.Rejected, new[] { ReportStatus.Reviewing } }
      };

      if (!validTransitions.TryGetValue(currentStatus, out var allowedStatuses))
        throw new ReportOperationException("UpdateStatus", $"Unknown current status: {currentStatus}");

      if (!allowedStatuses.Contains(newStatus))
        throw new ReportOperationException("UpdateStatus", $"Cannot transition from {currentStatus} to {newStatus}");
    }

    private static ReportDetailResponseDtos MapToDetailResponse(ReportEntity report)
    {
      return new ReportDetailResponseDtos
      {
        ClientInfo = new ReportClientResponseDtos
        {
          Id = report.Id,
          ReporterId = report.ReporterId,
          TargetId = report.TargetId,
          TargetType = report.TargetType,
          Category = report.Category,
          Title = report.Title,
          Description = report.Description,
          Status = report.Status,
          CreatedAt = report.CreatedAt,
          UpdatedAt = report.UpdatedAt
        },
        AdminInfo = new ReportAdminResponseDtos
        {
          Id = report.Id,
          Status = report.Status,
          AssignedAdminId = report.AssignedAdminId,
          CreatedAt = report.CreatedAt,
          UpdatedAt = report.UpdatedAt
        },
        Evidences = report.Evidences,
        Comments = report.Comments,
        History = report.History,
        Actions = report.Actions
      };
    }

    #endregion
  }
}
