namespace Review.Application.Contracts;

public sealed record ReviewDeletedEvent
(
  string ReviewId,
  string ProductId,
  string UserId,
  DateTime DeletedAt
);

public sealed record ReplyDeletedEvent
(
  string ReplyId,
  string ReviewId,
  string SellerId,
  DateTime DeletedAt
);
