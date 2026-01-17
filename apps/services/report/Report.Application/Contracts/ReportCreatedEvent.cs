namespace Report.Application.Contracts;


  public sealed record ReportCreatedEvent(
      string ReportId,
      string ReporterId,
      string TargetId,
      int TargetType,
      int Category,
      string Title,
      string Description,
      string Status,
      DateTime CreatedAt
  );

