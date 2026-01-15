
namespace Report.Application.Contracts;

public sealed record ReportDeletedEvent(
    string ReportId,
    string DeletedBy,
    string Reason,
    bool IsPermanent,
    DateTime DeletedAt
);
