namespace Review.Application.Contracts;

public sealed record ReviewCreatedEvent
(
  string ReviewId,
  string ProductId,
  string UserId,
  string SellerId,
  string OrderId,
  string OrderItemId,
  int Rating,
  string Content,
  List<string> Medias,
  DateTime CreatedAt
);

public sealed record ReplyCreatedEvent
(
  string ReplyId,
  string ReviewId,
  string SellerId,
  string Content,
  DateTime CreatedAt
);
