using System.ComponentModel.DataAnnotations.Schema;
using Report.Domain.Enums;
using SharedKernel;


namespace Report.Domain.Entities
{
    [Table("reports")] // Thông tin báo cáo từ người dùng
    public class ReportEntity : BaseAuditableEntity
    {
        public required string ReporterId { get; set; }
        public required string TargetId { get; set; }
        public ReportTargetType TargetType { get; set; }
        public ReportCategory Category { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public ReportStatus Status { get; set; } = ReportStatus.Pending;
        public required string AssignedAdminId { get; set; }

        public List<ReportEvidence> Evidences { get; set; } = new();
        public List<ReportComment> Comments { get; set; } = new();
        public List<ReportHistory> History { get; set; } = new();
        public List<ReportAction> Actions { get; set; } = new();
    }

    [Table("report_evidences")] // Bằng chứng do người dùng hoặc admin thêm vào
    public class ReportEvidence : BaseAuditableEntity
    {
        public required string ReportId { get; set; }
        public required string Url { get; set; }
        public required string EvidenceType { get; set; }
        public string? Note { get; set; }
        public ReportEntity? Report { get; set; }
    }

    [Table("report_comments")] // Bình luận của người dùng và admin 
    public class ReportComment : BaseAuditableEntity
    {
        public required string ReportId { get; set; }
        public required string UserId { get; set; }
        public required string Role { get; set; }
        public required string Comment { get; set; }
        public ReportEntity? Report { get; set; }
    }

    [Table("report_histories")] // Lịch sử thay đổi trạng thái báo cáo
    public class ReportHistory : BaseAuditableEntity
    {
        public required string ReportId { get; set; }
        public ReportStatus OldStatus { get; set; }
        public ReportStatus NewStatus { get; set; }
        public required string AdminId { get; set; }
        public string? Note { get; set; }
        public ReportEntity? Report { get; set; }
    }

    [Table("report_actions")] // Quyết định cuối của Admin
    public class ReportAction : BaseAuditableEntity
    {
        public required string ReportId { get; set; }
        public required string AdminId { get; set; }
        public ReportActionType ActionType { get; set; } = ReportActionType.Unknown;
        public string? Reason { get; set; }
        public ReportEntity? Report { get; set; }
    }
}
