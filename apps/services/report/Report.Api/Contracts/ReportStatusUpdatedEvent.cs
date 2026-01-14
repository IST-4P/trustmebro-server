public sealed record ReportStatusUpdatedEvent(
    string ReportId,
    string OldStatus,
    string NewStatus,
    string AdminId,
    string? Note,
    DateTime UpdatedAt
);
