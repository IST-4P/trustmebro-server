using Report.Domain.Entities;
using Report.Domain.Enums;
using SharedKernel;

namespace Report.Application.Dtos
{
    public class ReportClientResponseDtos : BaseAuditableEntity
    {
        public required string ReporterId { get; set; }
        public required string TargetId { get; set; }
        public ReportTargetType TargetType { get; set; }
        public ReportCategory Category { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public ReportStatus Status { get; set; }
    }

    public class ReportAdminResponseDtos : BaseAuditableEntity
    {
        public ReportStatus Status { get; set; }
        public required  string AssignedAdminId { get; set; }
    }

    public class ReportActionResponseDtos : BaseAuditableEntity
    {
        public required string AdminId { get; set; }
        public ReportActionType ActionType { get; set; }
        public string? Note { get; set; }
    }

    public class ReportDetailResponseDtos
    {
        public required ReportClientResponseDtos ClientInfo { get; set; }
        public required ReportAdminResponseDtos AdminInfo { get; set; }
        public List<ReportEvidence>? Evidences { get; set; }
        public List<ReportComment>? Comments { get; set; }
        public List<ReportHistory>? History { get; set; }
        public List<ReportAction>? Actions { get; set; }
    }

    public class ReportDashboardResponseDtos
    {
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int InProgressReports { get; set; }
        public int ResolvedReports { get; set; }
        public int RejectedReports { get; set; }
    }

    public class ReportListItemDto
    {
      public string Id { get; set; }
      public string ReporterId { get; set; }
      public string TargetId { get; set; }
      public ReportStatus Status { get; set; }
      public ReportCategory Category { get; set; }
      public ReportTargetType TargetType { get; set; }
      public DateTime CreatedAt { get; set; }
    }




}
