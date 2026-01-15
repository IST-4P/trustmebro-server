namespace Review.Application.Contracts;

public sealed record ReviewUpdatedEvent
(
  string ReviewId,
  string ProductId,
  string UserId,
  int Rating,
  string Content,
  List<string> Medias,
  DateTime UpdatedAt
);

public sealed record ReplyUpdatedEvent
(
  string ReplyId,
  string ReviewId,
  string SellerId,
  string Content,
  DateTime UpdatedAt
);
