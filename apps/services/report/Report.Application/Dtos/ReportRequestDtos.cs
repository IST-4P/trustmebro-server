using Report.Domain.Enums;
using Report.Domain.Entities;

namespace Report.Application.Dtos
{
    public class ReportClientRequestDtos
    {
        public required string ReporterId { get; set; }
        public required string TargetId { get; set; }
        public ReportTargetType TargetType { get; set; }
        public ReportCategory Category { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }

    }

    public class ReportAdminRequestDtos
    {
        public ReportStatus Status { get; set; }
        public required string AssignedAdminId { get; set; }
    }

    public class ReportAdminActionRequestDtos
    {
        public required string ReportId { get; set; }
        public required string AdminId { get; set; }
        public ReportActionType ActionType { get; set; }
        public string? Note { get; set; }
        
  }

    public class AddReportEvidenceDtos
    {
        public required string ReportId { get; set; }
        public required string Url { get; set; }
        public required string EvidenceType { get; set; }
        public string? Note { get; set; }
    }

    public class AddReportCommentDtos
    {
        public required string ReportId { get; set; }
        public required string UserId { get; set; }
        public required string Role { get; set; }
        public required string Comment { get; set; }
    }

    public class UpdateReportStatusDtos
    {
        public ReportStatus NewStatus { get; set; }
        public required string AdminId { get; set; }
        public string? Note { get; set; }
    }

    public class ReportFilterDtos
    {
        public ReportStatus? Status { get; set; }
        public ReportCategory? Category { get; set; }
        public ReportTargetType? TargetType { get; set; }
        public string? AssignedAdminId { get; set; }
        public string? ReporterId { get; set; }
        public string? TargetId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

  }

    




}
